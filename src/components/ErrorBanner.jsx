import { WarnIcon } from './icons';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="error-banner" onClick={onDismiss} role="alert">
      <WarnIcon />
      <div className="error-banner-text">{message}</div>
    </div>
  );
}
