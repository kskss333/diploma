import { Typography } from 'antd';
import ReactMarkdown from 'react-markdown';

const { Title, Text } = Typography;

export default function TheoryStep({ content }) {
  if (!content) return <Text>Нет содержимого</Text>;
  const title = content.title || 'Теория';
  const text = content.content || content.text || '';

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 800 }}>
      <Title level={3} style={{ fontWeight: 700, marginBottom: 24 }}>{title}</Title>
      <div style={{
        fontSize: 16, lineHeight: 1.9, color: '#374151',
        background: '#FAFAFA', padding: '28px 32px', borderRadius: 14,
        border: '1px solid #F3F4F6',
      }}>
        {text ? <ReactMarkdown>{text}</ReactMarkdown> : <Text type="secondary">Нет содержимого для отображения.</Text>}
      </div>
    </div>
  );
}