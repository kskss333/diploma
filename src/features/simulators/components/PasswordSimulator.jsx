import { useState } from 'react';
import { Input, Typography, Card, Button, Space, Progress, Tag, Statistic } from 'antd';
import { LockOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const COMMON = new Set(['password','123456','12345678','qwerty','abc123','monkey','letmein','dragon','iloveyou','пароль','admin','user','111111','000000']);

function strength(pw) {
  if (!pw) return { s: 0, l: '–', c: '#E5E7EB', fb: [] };
  let sc = 0; const fb = [];
  if (pw.length >= 8) sc++; else fb.push('Минимум 8 символов');
  if (pw.length >= 12) sc++; else if (pw.length >= 8) fb.push('Добавьте ещё 4 символа');
  if (pw.length >= 16) sc++;
  if (/[a-z]/.test(pw)) sc++; else fb.push('Строчные буквы');
  if (/[A-Z]/.test(pw)) sc++; else fb.push('Заглавные буквы');
  if (/[0-9]/.test(pw)) sc++; else fb.push('Цифры');
  if (/[^a-zA-Z0-9]/.test(pw)) sc++; else fb.push('Спецсимволы');
  if (COMMON.has(pw.toLowerCase())) { sc = Math.max(0, sc - 4); fb.length = 0; fb.push('Пароль в списке популярных!'); }
  const pct = Math.round((sc / 7) * 100);
  let l, c;
  if (pct <= 25) { l = 'Очень слабый'; c = '#DC2626'; } else if (pct <= 50) { l = 'Слабый'; c = '#F59E0B'; } else if (pct <= 75) { l = 'Средний'; c = '#D97706'; } else if (pct < 100) { l = 'Надёжный'; c = '#16A34A'; } else { l = 'Очень надёжный'; c = '#16A34A'; }
  return { s: pct, l, c, fb };
}

function crackTime(pw) {
  if (!pw) return '–';
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  if (!pool) pool = 10;
  const sec = Math.pow(pool, pw.length) / 1e9;
  if (sec < 1) return 'мгновенно';
  if (sec < 60) return `${Math.round(sec)} сек.`;
  if (sec < 3600) return `${Math.round(sec / 60)} мин.`;
  if (sec < 86400) return `${Math.round(sec / 3600)} ч.`;
  return `${Math.round(sec / 86400)} дн.`;
}

export default function PasswordSimulator({ taskData, onComplete, onAttempt }) {
  const [pw, setPw] = useState('');
  const st = strength(pw);
  const passed = st.s >= 70;

  return (
    <div style={{ maxWidth: 700 }}>
      <Title level={4}><LockOutlined style={{ marginRight: 8, color: '#2563EB' }} />{taskData?.title || 'Парольная безопасность'}</Title>
      <Card style={{ borderRadius: 16, marginBottom: 20 }} bodyStyle={{ padding: '24px' }}>
        <Input.Password size="large" value={pw} onChange={e => { setPw(e.target.value); onAttempt?.(); }} placeholder="Придумайте пароль..." style={{ borderRadius: 12 }} />
        {pw && <div className="fade-in" style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text strong>Надёжность:</Text><Tag color={st.c}>{st.l}</Tag></div>
          <Progress percent={st.s} strokeColor={st.c} size="small" style={{ marginTop: 8 }} />
          {st.fb.length > 0 && <div style={{ marginTop: 8, background: '#FFF7ED', padding: '10px 14px', borderRadius: 10 }}>{st.fb.map((f, i) => <Text key={i} style={{ display: 'block', color: '#9A3412', fontSize: 13 }}>• {f}</Text>)}</div>}
        </div>}
      </Card>
      {pw && <Card style={{ borderRadius: 16, marginBottom: 20, background: '#F0F9FF' }} bodyStyle={{ padding: '20px 24px' }}>
        <ThunderboltOutlined style={{ fontSize: 28, color: '#D97706' }} />
        <Text strong style={{ marginLeft: 10 }}>Время подбора:</Text>
        <Statistic value={crackTime(pw)} valueStyle={{ color: crackTime(pw) === 'мгновенно' ? '#DC2626' : '#16A34A', fontWeight: 700 }} />
      </Card>}
      <Space>
        <Button type="primary" size="large" disabled={!pw}
          onClick={() => onComplete?.({ score: passed ? 100 : st.s, passed, attempts: 1 })}
          style={{ borderRadius: 12, fontWeight: 600 }}>Завершить</Button>
        <Button size="large" onClick={() => setPw('')} style={{ borderRadius: 12 }}>Сбросить</Button>
      </Space>
    </div>
  );
}