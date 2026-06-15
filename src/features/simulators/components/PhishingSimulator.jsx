import { useReducer, useEffect } from 'react';
import { Button, Typography, Badge, Space, Progress, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title, Text, Paragraph } = Typography;

const init = { emails: [], idx: 0, answers: [], status: 'idle', feedback: null, score: 0 };

function reducer(s, a) {
  switch (a.type) {
    case 'INIT': return { ...s, emails: a.payload, idx: 0, answers: [], status: 'idle', feedback: null, score: 0 };
    case 'ANSWER': {
      const mail = s.emails[s.idx];
      const ok = mail.isPhishing === a.payload;
      return {
        ...s,
        answers: [...s.answers, { id: mail.id, ans: a.payload, ok }],
        status: 'reviewing',
        feedback: {
          ok,
          text: ok
            ? `✅ Верно! Это ${mail.isPhishing ? 'фишинговое' : 'безопасное'} письмо.`
            : `❌ Ошибка! Это ${mail.isPhishing ? 'фишинговое' : 'безопасное'} письмо.`,
          clues: mail.clues || [],
        },
        score: s.score + (ok ? 1 : 0),
      };
    }
    case 'NEXT': {
      const n = s.idx + 1;
      return { ...s, idx: n, status: n >= s.emails.length ? 'done' : 'idle', feedback: null };
    }
    default: return s;
  }
}

export default function PhishingSimulator({ taskData, onComplete, onAttempt }) {
  const [s, d] = useReducer(reducer, init);
  useEffect(() => { if (taskData?.emails) d({ type: 'INIT', payload: [...taskData.emails].sort(() => Math.random() - 0.5) }); }, [taskData]);
  if (s.emails.length === 0) return <Text>Загрузка...</Text>;

  const finalScore = Math.round((s.score / s.emails.length) * 100);
  const passThreshold = taskData?.passThreshold || 70;
  const passed = finalScore >= passThreshold;

  if (s.status === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Title level={3}>Тренажёр завершён!</Title>
        <Progress type="circle" percent={finalScore} status={passed ? 'success' : 'exception'} style={{ margin: '20px 0' }} />
        <Paragraph style={{ color: passed ? '#16A34A' : '#DC2626', fontSize: 16 }}>
          {passed ? 'Отлично! Вы хорошо распознаёте фишинг.' : `Не пройдено. Нужно ${passThreshold}%, набрано ${finalScore}%.`}
        </Paragraph>
        <Space>
          <Button onClick={() => d({ type: 'INIT', payload: [...taskData.emails].sort(() => Math.random() - 0.5) })}>Пройти заново</Button>
          {passed && <Button type="primary" onClick={() => onComplete?.({ score: finalScore, passed: true, attempts: 1 })}>Далее</Button>}
        </Space>
      </div>
    );
  }

  const mail = s.emails[s.idx];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div><Title level={4} style={{ margin: 0 }}>{taskData?.title || 'Тренажёр фишинга'}</Title><Text type="secondary">{taskData?.description}</Text></div>
        <Badge count={`${s.idx + 1}/${s.emails.length}`} style={{ backgroundColor: '#2563EB' }} />
      </div>
      <Progress percent={Math.round((s.idx / s.emails.length) * 100)} size="small" style={{ marginBottom: 20 }} />
      <div className="email-client" style={{ marginBottom: 20 }}>
        <div className="email-client-header"><Text strong>От: {mail.displayName} &lt;{mail.from}&gt;</Text><Text strong>Тема: {mail.subject}</Text></div>
        <div className="email-client-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mail.body) }} onClick={e => { if (e.target.tagName === 'A') e.preventDefault(); }} />
      </div>
      {s.status === 'reviewing' && s.feedback && (
        <Alert type={s.feedback.ok ? 'success' : 'error'} message={s.feedback.text}
          description={s.feedback.clues.length > 0 && <ul style={{ marginTop: 4, paddingLeft: 18 }}>{s.feedback.clues.map((c, i) => <li key={i}>{c}</li>)}</ul>}
          style={{ marginBottom: 20, borderRadius: 14 }} showIcon icon={s.feedback.ok ? <CheckCircleOutlined /> : <CloseCircleOutlined />} />
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {s.status === 'idle' && <>
          <Button size="large" type="primary" style={{ backgroundColor: '#16A34A', borderRadius: 12, minWidth: 140, fontWeight: 600 }}
            onClick={() => { onAttempt?.(); d({ type: 'ANSWER', payload: false }); }}>Безопасное</Button>
          <Button size="large" danger style={{ borderRadius: 12, minWidth: 140, fontWeight: 600 }}
            onClick={() => { onAttempt?.(); d({ type: 'ANSWER', payload: true }); }}>Фишинг</Button>
        </>}
        {s.status === 'reviewing' && (
          <Button size="large" type="primary" onClick={() => d({ type: 'NEXT' })}
            style={{ borderRadius: 12, minWidth: 160, fontWeight: 600 }}>
            {s.idx >= s.emails.length - 1 ? 'Завершить' : 'Следующее письмо'}
          </Button>
        )}
      </div>
    </div>
  );
}