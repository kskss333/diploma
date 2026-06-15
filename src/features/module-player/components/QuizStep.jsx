import { useState } from 'react';
import { Typography, Radio, Button, Space, Result, Card } from 'antd';

const { Title, Text } = Typography;

export default function QuizStep({ content, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(null);
  if (!content?.questions) return <Text>Нет вопросов</Text>;

  const select = (qId, val) => { if (!done) setAnswers(p => ({ ...p, [qId]: val })); };
  const submit = () => {
    let c = 0;
    content.questions.forEach(q => { if (answers[q.id] === q.correct) c++; });
    const s = Math.round((c / content.questions.length) * 100);
    setScore(s); setDone(true);
  };

  if (done) {
    const passed = score >= 70;
    return (
      <Result
        status={passed ? 'success' : 'warning'}
        title={`Результат: ${score}%`}
        subTitle={passed ? 'Тест пройден успешно!' : 'Тест не пройден. Нужно минимум 70%.'}
        extra={
          <Space>
            <Button onClick={() => { setDone(false); setAnswers({}); setScore(null); }}>Пройти заново</Button>
            {passed && <Button type="primary" onClick={() => onComplete(true)}>Далее</Button>}
          </Space>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <Title level={4}>{content.title || 'Проверка знаний'}</Title>
      {content.questions.map((q, i) => (
        <Card key={q.id} style={{ marginBottom: 20, borderRadius: 14, border: '1px solid #E2E8F0' }} bodyStyle={{ padding: '18px 20px' }}>
          <Text strong style={{ fontSize: 15 }}>{i + 1}. {q.text}</Text>
          <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }} value={answers[q.id]} onChange={e => select(q.id, e.target.value)}>
            {q.options.map((o, oi) => <Radio key={oi} value={oi} style={{ fontSize: 14 }}>{o}</Radio>)}
          </Radio.Group>
        </Card>
      ))}
      <Button type="primary" size="large" onClick={submit}
        disabled={Object.keys(answers).length < content.questions.length}
        style={{ borderRadius: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
        Проверить
      </Button>
    </div>
  );
}