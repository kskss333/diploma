import { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Progress, Card, Spin, Modal, Steps, Empty, message, Tag, Badge } from 'antd';
import {
  ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined,
  CheckCircleOutlined, LoadingOutlined,
  BookOutlined, ThunderboltOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';
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

const simMap = {
  phishing: PhishingSimulator,
  password: PasswordSimulator,
  social: SocialSimulator,
  access: AccessSimulator,
};

const stepIcons = {
  theory: <BookOutlined />,
  simulation: <ThunderboltOutlined />,
  quiz: <QuestionCircleOutlined />,
};

const stepLabels = {
  theory: 'Теория',
  simulation: 'Тренажёр',
  quiz: 'Тест',
};

const stepColors = {
  theory: '#2563EB',
  simulation: '#D97706',
  quiz: '#16A34A',
};

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
        const [mod, steps] = await Promise.all([
          axios.get(`/api/modules/${moduleId}`),
          axios.get(`/api/modules/${moduleId}/steps`),
        ]);
        send({ type: 'LOAD', steps: steps.data.steps, info: mod.data.module });
      } catch { message.error('Ошибка загрузки модуля'); }
    })();
  }, [moduleId]);

  const save = (isComplete = false) => {
    const totalSteps = state.steps.length;
    const completedIdx = isComplete ? totalSteps : state.idx + 1;
    const percent = Math.round((completedIdx / totalSteps) * 100);
    dispatch(saveProgress({
      module_id: moduleId,
      current_step_index: state.idx,
      status: isComplete ? 'completed' : 'in_progress',
      score: percent,
      attempts: 1,
    }));
  };

  if (state.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 140 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 44, color: '#2563EB' }} spin />} />
        <Text style={{ display: 'block', marginTop: 20, color: '#94A3B8', fontSize: 15 }}>Загрузка модуля...</Text>
      </div>
    );
  }

  if (state.status === 'done') {
    save(true);
    return (
      <div className="animate-bounce-in" style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
        <Card style={{ borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
          bodyStyle={{ padding: '48px 32px' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #16A34A, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 30px rgba(22,163,74,0.3)' }}>
            <CheckCircleOutlined style={{ fontSize: 40, color: '#FFF' }} />
          </div>
          <Title level={2} style={{ fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Модуль пройден!</Title>
          <Text style={{ fontSize: 16, color: '#64748B', display: 'block', marginBottom: 8 }}>
            Вы успешно завершили модуль «{state.info?.title}»
          </Text>
          <div style={{ marginTop: 32 }}>
            <Button type="primary" size="large" onClick={() => nav('/catalog')}
              style={{ borderRadius: 14, height: 50, padding: '0 32px', fontSize: 16, fontWeight: 600, boxShadow: '0 6px 20px rgba(37,99,235,0.3)' }}>
              Вернуться в каталог
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const step = state.steps[state.idx];
  const pct = Math.round(((state.idx + 1) / state.steps.length) * 100);

  const renderStep = () => {
    if (!step) return <Empty description="Шаг не найден" />;
    switch (step.type) {
      case 'theory':
        return <TheoryStep content={step.content} />;
      case 'quiz':
        return (
          <QuizStep
            content={step.content}
            onComplete={(passed) => {
              if (passed) {
                save();
                send({ type: 'NEXT' });
              } else {
                message.warning('Тест не пройден. Нужно набрать минимум 70%. Попробуйте ещё раз.');
              }
            }}
          />
        );
      case 'simulation': {
        const Sim = simMap[step.task_type];
        return Sim ? (
          <Sim
            taskData={step.content}
            difficulty={state.info?.difficulty || 'basic'}
            onComplete={(result) => {
              if (result.passed) {
                save();
                send({ type: 'NEXT' });
              } else {
                message.warning(`Тренажёр не пройден. Набрано ${result.score}%, нужно минимум ${step.content?.passThreshold || 70}%. Попробуйте ещё раз.`);
              }
            }}
            onAttempt={() => {}}
          />
        ) : <Empty description="Тип тренажёра не поддерживается" />;
      }
      default:
        return <Empty description="Неизвестный тип шага" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, padding: '14px 20px', background: '#FFFFFF',
        borderRadius: 18, border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <Button type="text" icon={<CloseOutlined style={{ fontSize: 18 }} />}
          onClick={() => send({ type: 'EXIT' })}
          style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        <div style={{ textAlign: 'center' }}>
          <Text strong style={{ fontSize: 16, color: '#0F172A' }}>{state.info?.title}</Text>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2 }}>
            <Badge status="processing" color={stepColors[step?.type]} />
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>
              Шаг {state.idx + 1} из {state.steps.length} · {stepLabels[step?.type] || 'Неизвестно'}
            </Text>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Progress type="circle" percent={pct} size={42} strokeColor="#2563EB" trailColor="#E2E8F0" strokeWidth={8} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <Card style={{
          width: 250, borderRadius: 18, border: '1px solid #E2E8F0', height: 'fit-content',
          position: 'sticky', top: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }} bodyStyle={{ padding: 16 }}>
          <Text strong style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 14 }}>
            Структура модуля
          </Text>
          <Steps
            direction="vertical"
            size="small"
            current={state.idx}
            items={state.steps.map((s, i) => ({
              title: <span style={{ fontSize: 13, fontWeight: i === state.idx ? 600 : 400 }}>{s.content?.title || `Шаг ${i + 1}`}</span>,
              description: (
                <Tag style={{ borderRadius: 6, fontSize: 10, marginTop: 2, background: stepColors[s.type] + '15', color: stepColors[s.type], border: 'none' }}>
                  {stepIcons[s.type]} {stepLabels[s.type]}
                </Tag>
              ),
              status: i < state.idx ? 'finish' : i === state.idx ? 'process' : 'wait',
            }))}
          />
        </Card>

        <Card style={{
          flex: 1, borderRadius: 18, border: '1px solid #E2E8F0', minHeight: 440,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }} bodyStyle={{ padding: '28px 32px' }}>
          {renderStep()}

          {step?.type === 'theory' && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 36,
              paddingTop: 20, borderTop: '1px solid #E2E8F0',
            }}>
              <Button icon={<ArrowLeftOutlined />} disabled={state.idx === 0}
                onClick={() => send({ type: 'PREV' })} size="large" style={{ borderRadius: 12, fontWeight: 500 }}>
                Назад
              </Button>
              <Button type="primary" icon={<ArrowRightOutlined />}
                onClick={() => { save(); send({ type: 'NEXT' }); }} size="large"
                style={{ borderRadius: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
                Далее
              </Button>
            </div>
          )}
        </Card>
      </div>

      <Modal title="Выйти из модуля?" open={state.exit}
        onOk={() => { save(); nav('/catalog'); }}
        onCancel={() => send({ type: 'EXIT' })}
        okText="Выйти" cancelText="Продолжить"
        okButtonProps={{ style: { borderRadius: 10, fontWeight: 600 } }}
        cancelButtonProps={{ style: { borderRadius: 10 } }}>
        <Text style={{ color: '#64748B' }}>Ваш прогресс будет сохранён автоматически.</Text>
      </Modal>
    </div>
  );
}