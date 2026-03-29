import { useEffect, useState } from 'react';

function toStr(msg) {
  if (!msg) return '';
  if (typeof msg === 'string') return msg;
  if (typeof msg === 'object') return msg.message || msg.error || JSON.stringify(msg).slice(0, 100);
  return String(msg);
}

export default function Toast({ message, type = 'info', onClose }) {
  const [visible, setVisible] = useState(true);
  const text = toStr(message);
  useEffect(() => { const t = setTimeout(() => { setVisible(false); onClose?.(); }, 4000); return () => clearTimeout(t); }, []);
  if (!visible || !text) return null;
  const colors = { error: { bg: '#e8472a', icon: '❌' }, success: { bg: '#16a34a', icon: '✅' }, info: { bg: '#1a1a1a', icon: 'ℹ️' } };
  const c = colors[type] || colors.info;
  return (
    <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: c.bg, color: 'white', padding: '14px 20px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', zIndex: 9999, maxWidth: '90vw', display: 'flex', alignItems: 'center', gap: '10px', animation: 'toastIn 0.3s ease' }}>
      <style>{`@keyframes toastIn { from{transform:translateX(-50%) translateY(20px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }`}</style>
      <span>{c.icon}</span><span>{text}</span>
      <button onClick={() => { setVisible(false); onClose?.(); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>×</button>
    </div>
  );
}
