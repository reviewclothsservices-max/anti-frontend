import { useUI } from '../context/UIContext';
import './Toast.css';

export default function Toast() {
  const { toasts } = useUI();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type || 'success'}`}>
          {t.type === 'success' && <span className="toast-icon">✓</span>}
          {t.type === 'info' && <span className="toast-icon">ℹ</span>}
          {t.type === 'error' && <span className="toast-icon">✕</span>}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
