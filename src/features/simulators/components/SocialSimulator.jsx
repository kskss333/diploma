import { useState, useEffect, useRef } from 'react';
import { Button, Typography, Space, Progress, Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SCENARIO = {
  nodes: [
    {
      id: 'start', name: 'Служба безопасности банка',
      msg: 'Здравствуйте! Это служба безопасности банка "Надёжный". Наша система зафиксировала подозрительную операцию по вашей карте: перевод 45 000₽ в другой регион. Вы подтверждаете эту операцию?',
      opts: [
        { text: 'Нет, это не я! Что делать?!', next: 'panic', score: -1, fb: '⚠️ Вы показали панику. Мошенник понимает, что вы уязвимы и готовы следовать инструкциям.' },
        { text: 'Да, это я делал перевод', next: 'trust', score: -1, fb: '⚠️ Вы подтвердили несуществующую операцию. Теперь мошенник знает, что вы доверчивы.' },
        { text: 'Назовите номер карты, с которой был перевод', next: 'verify', score: 2, fb: '✅ Отлично! Вы требуете конкретные данные, которые есть только у настоящего банка.' },
      ],
    },
    {
      id: 'verify', name: 'Служба безопасности банка',
      msg: 'Карта заканчивается на 4738. Слушайте, у нас каждая секунда на счету! Ваши деньги под угрозой. Чтобы отменить перевод, мне нужен CVV-код с обратной стороны вашей карты.',
      opts: [
        { text: 'Назвать CVV-код: 123', next: 'bad_end', score: -3, fb: '⚠️ Катастрофа! CVV-код — это ключ к вашим деньгам. Настоящий банк НИКОГДА его не запрашивает ни по телефону, ни в сообщениях.' },
        { text: 'Я сейчас перезвоню в банк по официальному номеру', next: 'good_end', score: 3, fb: '✅ Идеальное решение! Всегда перезванивайте по номеру, указанному на обратной стороне карты.' },
        { text: 'Почему вы спрашиваете CVV? Разве это безопасно?', next: 'verify2', score: 1, fb: '👍 Хороший вопрос! Вы проявляете бдительность. Но мошенник попытается вас убедить.' },
      ],
    },
    {
      id: 'verify2', name: 'Служба безопасности банка',
      msg: 'Это стандартная процедура безопасности. Если вы не назовёте CVV, я не смогу отменить перевод, и вы потеряете 45 000₽. У вас есть ровно 2 минуты, пока транзакция не завершилась.',
      opts: [
        { text: 'Хорошо, CVV: 456', next: 'bad_end', score: -3, fb: '⚠️ Вас запугали срочностью. CVV никогда нельзя сообщать.' },
        { text: 'Я перезвоню в банк сам. До свидания.', next: 'good_end', score: 2, fb: '✅ Правильно! Срочность — главный инструмент мошенников. Не поддавайтесь.' },
      ],
    },
    {
      id: 'panic', name: 'Служба безопасности банка',
      msg: 'Не волнуйтесь, мы поможем! Для срочной блокировки перевода продиктуйте полный номер карты, срок действия и ваше полное имя как на карте.',
      opts: [
        { text: 'Продиктовать все данные', next: 'bad_end', score: -3, fb: '⚠️ Вы только что передали мошеннику всё необходимое для онлайн-покупок от вашего имени.' },
        { text: 'Я понял, что это мошенники. Кладу трубку.', next: 'good_end', score: 2, fb: '✅ Молодец, что распознали обман! Лучше поздно, чем никогда.' },
        { text: 'А вы точно из банка? Назовите моё имя', next: 'verify3', score: 1, fb: '👍 Вы требуете идентификации. Но мошенник может знать ваше имя из соцсетей.' },
      ],
    },
    {
      id: 'verify3', name: 'Служба безопасности банка',
      msg: 'Вы же Иванов Иван Петрович, 1990 года рождения, проживаете по адресу ул. Ленина, д. 15, кв. 42. Теперь вы мне верите? Назовите CVV для отмены перевода!',
      opts: [
        { text: 'Да, теперь верю. CVV: 789', next: 'bad_end', score: -3, fb: '⚠️ Эти данные мошенник мог найти в соцсетях или через утечки. CVV никогда не сообщайте.' },
        { text: 'Откуда у вас эти данные? Я звоню в полицию!', next: 'good_end', score: 2, fb: '✅ Отлично! Вы не дали себя обмануть даже при наличии личных данных.' },
      ],
    },
    {
      id: 'trust', name: 'Служба безопасности банка',
      msg: 'Хорошо. Для вашей безопасности мы вышлем новый пароль в SMS. Назовите, пожалуйста, код из SMS, который придёт вам через минуту.',
      opts: [
        { text: 'Назвать код из SMS', next: 'bad_end', score: -3, fb: '⚠️ Код из SMS — это последний рубеж. Злоумышленник прямо сейчас входит в ваш интернет-банк!' },
        { text: 'Я перезвоню в банк по официальному номеру', next: 'good_end', score: 2, fb: '✅ Правильно! Настоящий банк никогда не запрашивает коды из SMS.' },
        { text: 'А зачем вам код из SMS?', next: 'trust2', score: 1, fb: '👍 Вы задаёте правильный вопрос. Но мошенник подготовил ответ.' },
      ],
    },
    {
      id: 'trust2', name: 'Служба безопасности банка',
      msg: 'Это часть двухфакторной аутентификации для подтверждения вашей личности. Без этого кода я не могу заблокировать перевод. Время идёт!',
      opts: [
        { text: 'Ладно, код: 4829', next: 'bad_end', score: -3, fb: '⚠️ Вас обманули. Код из SMS используется для входа в аккаунт, а не для блокировки.' },
        { text: 'Я кладу трубку и звоню в банк', next: 'good_end', score: 2, fb: '✅ Превосходно! Двухфакторная аутентификация защищает вас, но только если вы не сообщаете коды.' },
      ],
    },
    { id: 'bad_end', name: 'Мошенник', msg: 'Спасибо за данные. *кладёт трубку* Ваши средства скоро будут списаны.', opts: [] },
    { id: 'good_end', name: null, msg: null, opts: [] },
  ],
};

export default function SocialSimulator({ taskData, onComplete, onAttempt }) {
  const [nodeId, setNodeId] = useState('start');
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const endRef = useRef(null);
  const scenario = taskData?.nodes ? taskData : SCENARIO;
  const node = scenario.nodes.find(n => n.id === nodeId);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const choose = (opt) => {
    setSelected(opt.text); onAttempt?.();
    setTimeout(() => {
      setTotal(p => p + opt.score);
      setHistory(p => [
        ...p,
        { role: 'user', text: opt.text },
        { role: 'fb', text: opt.fb, score: opt.score },
      ]);
      if (opt.next) {
        const next = scenario.nodes.find(n => n.id === opt.next);
        if (next?.msg) {
          setTimeout(() => {
            setHistory(p => [...p, { role: 'attacker', text: next.msg, name: next.name }]);
            setNodeId(opt.next);
            setSelected(null);
          }, 600);
        } else {
          setNodeId(opt.next);
          setDone(true);
          setSelected(null);
        }
      }
    }, 700);
  };

  const reset = () => {
    setNodeId('start');
    setHistory([]);
    setTotal(0);
    setDone(false);
    setSelected(null);
    setAttempts(a => a + 1);
  };

  if (done) {
    const maxScore = 6;
    const minScore = -9;
    const pct = Math.round(((total - minScore) / (maxScore - minScore)) * 100);
    const passed = pct >= 70;
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Title level={3}>Сценарий завершён</Title>
        <Progress type="circle" percent={pct} status={passed ? 'success' : 'exception'} style={{ margin: '20px 0' }} />
        <Text style={{ display: 'block', marginBottom: 8, fontSize: 16, color: passed ? '#16A34A' : '#DC2626' }}>
          {passed ? 'Отлично! Вы успешно противостояли социальной инженерии.' : `Не пройдено. ${pct}% правильных реакций, нужно 70%.`}
        </Text>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>Попыток: {attempts + 1}</Text>
        <Space>
          <Button onClick={reset} size="large" style={{ borderRadius: 12 }}>Пройти заново</Button>
          {passed && <Button type="primary" size="large" onClick={() => onComplete?.({ score: pct, passed: true, attempts: attempts + 1 })} style={{ borderRadius: 12, fontWeight: 600 }}>Далее</Button>}
        </Space>
        <div style={{ textAlign: 'left', maxWidth: 500, margin: '20px auto 0', background: '#F8FAFC', borderRadius: 14, padding: '16px 20px' }}>
          <Text strong style={{ display: 'block', marginBottom: 10 }}>Разбор ваших действий:</Text>
          {history.filter(h => h.role === 'fb').map((h, i) => (
            <div key={i} style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Tag color={h.score > 0 ? 'green' : h.score < 0 ? 'red' : 'orange'} style={{ borderRadius: 8, margin: 0 }}>
                {h.score > 0 ? '+' : ''}{h.score} балл
              </Tag>
              <Text style={{ fontSize: 13, color: '#475569', flex: 1 }}>{h.text}</Text>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          <RobotOutlined style={{ marginRight: 8, color: '#DC2626' }} />
          {taskData?.title || 'Социальная инженерия'}
        </Title>
        <Tag style={{ borderRadius: 10, fontWeight: 600 }}>Попытка {attempts + 1}</Tag>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Вам звонит незнакомец. Ваша задача — распознать приёмы социальной инженерии и не попасться.
      </Text>
      <div className="chat-container">
        <div className="chat-messages">
          <div className="chat-bubble attacker">
            <Text strong style={{ fontSize: 11, color: '#991B1B' }}>{node?.name || 'Неизвестный'}</Text>
            <br />
            <Text style={{ fontSize: 14 }}>{node?.msg}</Text>
          </div>
          {history.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role === 'attacker' ? 'attacker' : m.role === 'fb' ? 'attacker' : 'user'}`}>
              {m.role === 'attacker' && <Text strong style={{ fontSize: 11, color: '#991B1B' }}>{m.name}</Text>}
              <Text style={{ fontSize: 13, color: m.role === 'fb' ? (m.score > 0 ? '#16A34A' : '#DC2626') : 'inherit' }}>
                {m.text}
              </Text>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        {node?.opts?.length > 0 && !selected && (
          <div className="chat-input-area">
            {node.opts.map((opt, idx) => (
              <Button key={idx} onClick={() => choose(opt)} style={{ borderRadius: 10, fontWeight: 500 }}>{opt.text}</Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}