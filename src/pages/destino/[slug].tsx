// pages/destino/[slug].tsx
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'

const META = {
  usa: { title: 'Estados Unidos', emoji: '🇺🇸', blurb: 'Opciones para trabajo, estudio, familia y residencia en EE. UU.' },
  canada: { title: 'Canadá', emoji: '🇨🇦', blurb: 'Programas de estudio, trabajo calificado y residencia permanente.' },
  europa: { title: 'Europa', emoji: '🇪🇺', blurb: 'Rutas para la Unión Europea: estudio, empleo y reagrupación.' },
  otros: { title: 'Otros países', emoji: '🌎', blurb: 'Explora alternativas en LATAM, Asia y Oceanía.' },
} as const

type Slug = keyof typeof META

export default function DestinoPage() {
  const router = useRouter()
  const slug = (router.query.slug as Slug) || 'usa'
  const meta = META[slug as Slug]

  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!meta) {
    return (
      <main className="min-h-screen grid place-items-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Destino no encontrado</h1>
          <Link href="/" className="text-blue-700 hover:underline">Volver al inicio</Link>
        </div>
      </main>
    )
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setOk(null)
    setError(null)

    const fd = new FormData(e.currentTarget)

    // Honeypot
    if ((fd.get('company') as string)?.trim()) {
      setOk(true)
      setLoading(false)
      ;(e.currentTarget as HTMLFormElement).reset()
      return
    }

    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      preferred_date: null,
      message: String(fd.get('message') || ''),
      destination: slug,
    }

    try {
      const resp = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const ct = resp.headers.get('content-type') || ''
      const raw = await resp.text()
      const data = ct.includes('application/json') ? JSON.parse(raw) : null

      if (!resp.ok || !data?.ok) throw new Error(data?.error || `HTTP ${resp.status}: ${raw}`)

      setOk(true)
      ;(e.currentTarget as HTMLFormElement).reset()
    } catch (err: any) {
      setOk(false)
      setError(err?.message || 'Ups, algo salió mal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{`RHAI | ${meta.emoji} ${meta.title}`}</title>
        <meta name="description" content={`Información y formulario para ${meta.title}. ${meta.blurb}`}/>
      </Head>

      <main className="min-h-screen bg-white">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-blue-800 font-extrabold text-xl">RHAI</Link>
            <Link href="/" className="text-blue-700 hover:underline">← Volver</Link>
          </div>
        </header>

        <section className="bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 flex items-center gap-3">{meta.emoji} {meta.title}</h1>
              <p className="text-gray-600 mt-2">{meta.blurb}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Info rápida */}
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-3">¿Qué puedes hacer aquí?</h2>
                <ul className="text-gray-700 list-disc ml-5 space-y-2 text-sm">
                  <li>Leer requisitos y caminos típicos.</li>
                  <li>Dejar tus datos para una asesoría rápida.</li>
                  <li>Recibir seguimiento personalizado por email/teléfono.</li>
                </ul>
              </div>

              {/* Formulario */}
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-3">Formulario de contacto</h2>
                <form onSubmit={submit} className="space-y-4">
                  {/* honeypot */}
                  <input name="company" autoComplete="off" className="hidden" tabIndex={-1} />

                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre *</label>
                    <input name="name" required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input name="email" type="email" required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" placeholder="tu@correo.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input name="phone" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" placeholder="+1 809..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mensaje</label>
                    <textarea name="message" rows={4} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" placeholder="Cuéntanos tu caso breve..." />
                  </div>
                  <button disabled={loading} className="w-full rounded-xl bg-blue-700 text-white font-semibold py-3 hover:bg-blue-800 disabled:opacity-60">
                    {loading ? 'Enviando...' : 'Enviar'}
                  </button>

                  {ok === true && <p className="text-green-700 text-sm">¡Listo! Te contactaremos pronto. ✅</p>}
                  {ok === false && <p className="text-red-700 text-sm">Error: {error}</p>}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
