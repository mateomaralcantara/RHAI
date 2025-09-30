import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Método no permitido' });

  const { q, url, ts } = req.body || {};
  const text = `🔔 *Búsqueda en vivo*\n\n• Consulta: _${q || '(vacío)'}_\n• URL: ${url || '-'}\n• Hora: ${new Date(ts || Date.now()).toLocaleString()}`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chat) {
    console.warn('Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID');
    return res.status(200).json({ ok: true, warn: 'No Telegram env set' });
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'Markdown', disable_web_page_preview: true }),
    });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('Telegram error', e?.message);
    return res.status(500).json({ ok: false, error: 'No se pudo notificar' });
  }
}
