import { useState, useMemo, useCallback } from 'react';
import { Typography, Card, Checkbox, Button, Space, Table, Progress, Tag } from 'antd';
import { SafetyCertificateOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DEFAULT = {
  title: 'Настройка прав доступа к корпоративным файлам',
  description: 'Вы — системный администратор. Настройте права доступа к файлам компании в соответствии с политикой безопасности.',
  subjects: ['alice', 'bob', 'charlie', 'diana'],
  resources: ['report.txt', 'budget.xlsx', 'notes.doc', 'passwords.csv'],
  permissions: ['read', 'write', 'execute'],
  requirements: [
    { id: 'r1', subject: 'alice', resource: 'report.txt', read: true, write: true, execute: false, desc: 'Alice (менеджер) — чтение и запись report.txt' },
    { id: 'r2', subject: 'bob', resource: 'report.txt', read: true, write: false, execute: false, desc: 'Bob (стажёр) — только чтение report.txt' },
    { id: 'r3', subject: 'charlie', resource: 'report.txt', read: false, write: false, execute: false, forbidden: true, desc: 'Charlie (уволен) — полностью без доступа к report.txt' },
    { id: 'r4', subject: 'alice', resource: 'budget.xlsx', read: true, write: false, execute: false, desc: 'Alice — только чтение budget.xlsx (фин. отчёт)' },
    { id: 'r5', subject: 'bob', resource: 'budget.xlsx', read: true, write: true, execute: false, desc: 'Bob — чтение и запись budget.xlsx' },
    { id: 'r6', subject: 'diana', resource: 'notes.doc', read: true, write: true, execute: false, desc: 'Diana (секретарь) — чтение и запись notes.doc' },
    { id: 'r7', subject: 'diana', resource: 'passwords.csv', read: false, write: false, execute: false, forbidden: true, desc: 'Diana — без доступа к passwords.csv' },
    { id: 'r8', subject: 'alice', resource: 'passwords.csv', read: true, write: false, execute: false, desc: 'Alice — только чтение passwords.csv' },
  ],
};

export default function AccessSimulator({ taskData, onComplete, onAttempt }) {
  const task = taskData?.subjects ? taskData : DEFAULT;
  const [cfg, setCfg] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);

  const toggle = useCallback((sub, res, perm) => {
    onAttempt?.();
    setCfg(p => {
      const key = `${sub}:${res}`;
      const cur = p[key] || [];
      return { ...p, [key]: cur.includes(perm) ? cur.filter(x => x !== perm) : [...cur, perm] };
    });
  }, [onAttempt]);

  const results = useMemo(() => task.requirements.map(r => {
    const actual = cfg[`${r.subject}:${r.resource}`] || [];
    const ok = r.forbidden
      ? actual.length === 0
      : (r.read === undefined || actual.includes('read') === r.read) &&
        (r.write === undefined || actual.includes('write') === r.write) &&
        (r.execute === undefined || actual.includes('execute') === r.execute);
    return { ...r, ok, actual };
  }), [cfg, task.requirements]);

  const passedCount = results.filter(r => r.ok).length;
  const pct = Math.round((passedCount / task.requirements.length) * 100);
  const allOk = passedCount === task.requirements.length;

  const handleComplete = () => {
    setDone(true);
  };

  const handleReset = () => {
    setCfg({});
    setAttempts(a => a + 1);
    setDone(false);
  };

  const handleFinalComplete = () => {
    onComplete?.({ score: pct, passed: true, attempts: attempts + 1 });
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Title level={3}>Тренажёр завершён!</Title>
        <Progress type="circle" percent={100} status="success" style={{ margin: '20px 0' }} />
        <Text style={{ display: 'block', marginBottom: 16, fontSize: 16, color: '#16A34A' }}>
          Все требования выполнены! Вы правильно настроили права доступа.
        </Text>
        <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>Попыток: {attempts + 1}</Text>
        <Space>
          <Button onClick={handleReset} size="large" style={{ borderRadius: 12 }}>Настроить заново</Button>
          <Button type="primary" size="large" onClick={handleFinalComplete} style={{ borderRadius: 12, fontWeight: 600 }}>Далее</Button>
        </Space>
      </div>
    );
  }

  const columns = [
    {
      title: <Text strong>Ресурс</Text>,
      dataIndex: 'resource',
      key: 'resource',
      width: 150,
      render: (text) => <Text strong style={{ fontSize: 14 }}>{text}</Text>,
    },
    ...task.subjects.map(sub => ({
      title: <Text strong style={{ fontSize: 13 }}>{sub}</Text>,
      key: sub,
      render: (_, rec) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {task.permissions.map(perm => {
            const key = `${sub}:${rec.resource}`;
            const checked = (cfg[key] || []).includes(perm);
            const req = results.find(r => r.subject === sub && r.resource === rec.resource);
            const isRelevant = req && !req.forbidden;
            const isError = req && !req.ok && isRelevant;
            return (
              <Checkbox
                key={perm}
                checked={checked}
                onChange={() => toggle(sub, rec.resource, perm)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 8,
                  background: isError && checked ? '#FEF2F2' : isError && !checked ? '#FFFBEB' : checked ? '#F0FDF4' : 'transparent',
                  border: isError ? '1px solid #FECACA' : '1px solid transparent',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: 500 }}>
                  {perm === 'read' ? 'Чтение' : perm === 'write' ? 'Запись' : 'Исп.'}
                </Text>
              </Checkbox>
            );
          })}
        </div>
      ),
    })),
    {
      title: 'Статус',
      key: 'status',
      width: 70,
      align: 'center',
      render: (_, rec) => {
        const related = results.filter(r => r.resource === rec.resource);
        const allOk = related.every(r => r.ok);
        const hasIssues = related.some(r => !r.ok);
        if (related.length === 0) return <Tag style={{ borderRadius: 8 }}>—</Tag>;
        return allOk
          ? <CheckCircleOutlined style={{ color: '#16A34A', fontSize: 18 }} />
          : <CloseCircleOutlined style={{ color: '#DC2626', fontSize: 18 }} />;
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          <SafetyCertificateOutlined style={{ marginRight: 8, color: '#2563EB' }} />
          {task.title}
        </Title>
        <Tag style={{ borderRadius: 10, fontWeight: 600 }}>Попытка {attempts + 1}</Tag>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>{task.description}</Text>

      <Card
        title={<Text strong style={{ fontSize: 15 }}>Требования политики безопасности</Text>}
        size="small"
        style={{ marginBottom: 20, borderRadius: 14 }}
        bodyStyle={{ padding: '16px 20px' }}
      >
        {task.requirements.map(r => {
          const res = results.find(x => x.id === r.id);
          return (
            <div key={r.id} style={{ marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
              {res?.ok
                ? <CheckCircleOutlined style={{ color: '#16A34A' }} />
                : <CloseCircleOutlined style={{ color: '#DC2626' }} />}
              <Text style={{ fontSize: 13, color: res?.ok ? '#16A34A' : '#475569' }}>
                {r.desc}
                {!res?.ok && (
                  <Tag color="error" style={{ marginLeft: 8, borderRadius: 6, fontSize: 10 }}>Не выполнено</Tag>
                )}
              </Text>
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text strong>Прогресс выполнения требований:</Text>
        <Text style={{ fontWeight: 700, color: '#2563EB', fontSize: 16 }}>{passedCount} / {task.requirements.length}</Text>
      </div>
      <Progress
        percent={pct}
        status={allOk ? 'success' : 'active'}
        strokeColor={allOk ? '#16A34A' : '#2563EB'}
        style={{ marginBottom: 20 }}
      />

      <Card style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 20 }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={task.resources.map(r => ({ resource: r, key: r }))}
          pagination={false}
          bordered
          size="middle"
        />
      </Card>

      <Space>
        <Button
          type="primary"
          size="large"
          disabled={!allOk}
          onClick={handleComplete}
          style={{ borderRadius: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}
        >
          Завершить настройку
        </Button>
        <Button size="large" onClick={handleReset} style={{ borderRadius: 12 }}>
          Сбросить всё
        </Button>
      </Space>
    </div>
  );
}