import { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Progress, Card, Spin, Modal, Steps, Empty, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { saveProgress } from '@/features/progress/progressSlice';
import TheoryStep from '@/features/module-player/components/TheoryStep';
import QuizStep from '@/features/module-player/components/QuizStep';
import PhishingSimulator from '@/features/simulators/components/PhishingSimulator';
import PasswordSimulator from '@/features/simulators/components/PasswordSimulator';
import SocialSimulator from '@/features/simulators/components/SocialSimulator';
import AccessSimulator from '@/features/simulators/components/AccessSimulator';

const { Title, Text } = Typography;
const simMap = { phishing: PhishingSimulator, password: PasswordSimulator, social: SocialSimulator, access: AccessSimulator };

const init = { steps: [], idx: 0, status: 'loading', info: null, exit: false };

function reducer(s, a) {
  switch (a.type) {
    case 'LOAD': return { ...s, steps: a.steps, info: a.info, status: 'playing' };
    case 'NEXT': return s.idx >= s.steps.length - 1 ? { ...s, status: 'done' } : { ...s, idx: s.idx + 1 };
    case 'PREV': return s.idx <= 0 ? s : { ...s, idx: s.idx - 1 };
    case 'EXIT': return { ...s, exit: !s.exit };
    default: return s;
  }
}

export default function ModulePage() {
  const { moduleId } = useParams();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [state, send] = useReducer(reducer, init);

  useEffect(() => {
    (async () => {
      try {
        const [mod, steps] = await Promise.all([axios.get(`/api/modules/${moduleId}`), axios.get(`/api/modules/${moduleId}/steps`)]);
        send({ type: 'LOAD', steps: steps.data.steps, info: mod.data.module });
      } catch { message.error('Ошибка загрузки'); }
    })();
  }, [moduleId]);

  const handleSave = () => dispatch(saveProgress({ module_id: moduleId, current_step_index: state.idx, status: state.status === 'done' ? 'completed' : 'in_progress', score: null, attempts: 1 }));

  if (state.status === 'loading') return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  if (state.status === 'done') return (
    <div style={{ maxWidth: 700, margin: '40px auto', textAlign: 'center' }}>
      <Card style={{ borderRadius: 16, padding: '40px 24px' }}>
        <CheckCircleOutlined style={{ fontSize: 64, color: '#16A34A', marginBottom: 20 }} />
        <Title level={2}>Модуль пройден!</Title>
        <Button type="primary" size="large" onClick={() => nav('/catalog')} style={{ borderRadius: 10, marginTop: 20 }}>В каталог</Button>
      </Card>
    </div>
  );

  const step = state.steps[state.idx];
  const pct = Math.round(((state.idx + 1) / state.steps.length) * 100);

  const render = () => {
    if (!step) return <Empty />;
    switch (step.type) {
      case 'theory': return <TheoryStep content={step.content} />;
      case 'quiz': return <QuizStep content={step.content} onComplete={() => { handleSave(); send({ type: 'NEXT' }); }} />;
      case 'simulation': {
        const Sim = simMap[step.task_type];
        return Sim ? <Sim taskData={step.content} difficulty={state.info?.difficulty || 'basic'} onComplete={() => { handleSave(); send({ type: 'NEXT' }); }} onAttempt={() => {}} /> : <Empty />;
      }
      default: return <Empty />;
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '16px 20px', background: '#FFF', borderRadius: 12, border: '1px solid #E5E7EB' }}>
        <Button type="text" icon={<CloseOutlined />} onClick={() => send({ type: 'EXIT' })} />
        <div><Text strong>{state.info?.title}</Text><br /><Text type="secondary">Шаг {state.idx + 1} из {state.steps.length}</Text></div>
        <Progress percent={pct} size="small" style={{ width: 200 }} strokeColor="#2563EB" />
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        <Card style={{ width: 240, borderRadius: 12, height: 'fit-content' }} bodyStyle={{ padding: 12 }}>
          <Steps direction="vertical" size="small" current={state.idx} items={state.steps.map((s, i) => ({ title: s.content?.title || `Шаг ${i + 1}`, status: i < state.idx ? 'finish' : i === state.idx ? 'process' : 'wait' }))} />
        </Card>
        <Card style={{ flex: 1, borderRadius: 12 }} bodyStyle={{ padding: 28 }}>
          {render()}
          {step?.type === 'theory' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
              <Button icon={<ArrowLeftOutlined />} disabled={state.idx === 0} onClick={() => send({ type: 'PREV' })}>Назад</Button>
              <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => { handleSave(); send({ type: 'NEXT' }); }}>Далее</Button>
            </div>
          )}
        </Card>
      </div>
      <Modal title="Выйти?" open={state.exit} onOk={() => { handleSave(); nav('/catalog'); }} onCancel={() => send({ type: 'EXIT' })} okText="Выйти" cancelText="Остаться">
        <Text>Прогресс сохранится автоматически.</Text>
      </Modal>
    </div>
  );
}