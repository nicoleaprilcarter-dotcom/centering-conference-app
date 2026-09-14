import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCode({ value, size = 140 }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!value) return;
    QRCode.toDataURL(value, { width: size * 2, margin: 1, color: { dark: '#2E1035', light: '#FFFFFF' } })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return <div style={{ width: size, height: size, borderRadius: 12, background: '#F3EFF1' }} />;
  }

  return (
    <img
      src={dataUrl}
      alt="Badge QR code"
      width={size}
      height={size}
      style={{ borderRadius: 12, display: 'block' }}
    />
  );
}
