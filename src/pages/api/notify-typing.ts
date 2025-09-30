// src/pages/api/notify-typing.ts
import type { NextApiRequest, NextApiResponse } from 'next'

const token  = process.env.TELEGRAM_BOT_TOKEN!
const chatId = process.env.TELEGRAM_CHAT_ID!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'Missing env vars' })

  const { q } = req.body || {}
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'N/A'
  const ua = req.headers['user-agent'] || 'N/A'

  const text = [
    '🟢 Nuevo usuario está buscando en RHAI',
    `🔎 Término: ${q || '(vacío)'}`,
    `🌐 IP: ${ip}`,
    `🧭 UA: ${ua}`
  ].join('\n')

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  })
  const data = await resp.json()
  return res.status(200).json({ ok: true, data })
}
