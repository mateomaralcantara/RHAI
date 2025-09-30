// src/pages/destino/europa.tsx
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, type ChangeEvent } from 'react'

interface PayPalCaptureDetails {
  payer?: { name?: { given_name?: string } }
  id?: string
  status?: string
}

const DynamicPayPalButton = dynamic(() => import('../../components/PayPalButton'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-600">Cargando pasarela de pago…</p>,
})

export default function EuropaPage() {
  // --- ESTADO DE PAGO (sin formulario de datos) ---
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  // Opciones de pago
  const paymentOptions = [
    { id: 'consulta',     name: 'Consulta Migratoria (Europa)',      price: '25.00' },
    { id: 'estudio_eu',   name: 'Pre-chequeo Ruta de Estudio UE',    price: '90.00' },
    { id: 'donacion_fija',name: 'Donación Fija',                     price: '10.00' },
    { id: 'monto_abierto',name: 'Donación (Monto Abierto)',          price: '' },
  ] as const
  type PaymentOption = (typeof paymentOptions)[number]

  // Handlers
  const onSelect = (price: string, custom: boolean) => {
    setIsCustom(custom)
    if (custom) {
      setSelectedPrice(customAmount && parseFloat(customAmount) > 0 ? customAmount : null)
    } else {
      setCustomAmount('')
      setSelectedPrice(price)
    }
  }

  const onCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const re = /^\d*\.?\d{0,2}$/
    if (re.test(v) || v === '') {
      setCustomAmount(v)
      setSelectedPrice(parseFloat(v) > 0 ? v : null)
    }
  }

  const onPayOk = (d: PayPalCaptureDetails) => {
    alert(`¡Gracias por tu pago, ${d?.payer?.name?.given_name || 'Cliente'}!`)
    setSelectedPrice(null)
    setCustomAmount('')
    setIsCustom(false)
  }

  const amount = (isCustom ? customAmount : selectedPrice) || ''
  const okPay = !!amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0

  return (
    <>
      <Head>
        <title>RHAI | 🇪🇺 Europa</title>
        <meta name="description" content="Asesoría para Europa: estudio, trabajo, Blue Card, reagrupación y residencia." />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-orange-500 font-extrabold text-xl tracking-tight">RHAI</Link>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#estudio"   className="text-neutral-200 hover:text-orange-400">Estudio</a>
              <a href="#trabajo"   className="text-neutral-200 hover:text-orange-400">Trabajo</a>
              <a href="#bluecard"  className="text-neutral-200 hover:text-orange-400">EU Blue Card</a>
              <a href="#familia"   className="text-neutral-200 hover:text-orange-400">Familia</a>
              <a href="#residencia" className="text-neutral-200 hover:text-orange-400">Residencia</a>
            </nav>
            <Link href="/" className="text-orange-400 hover:text-orange-300">← Volver</Link>
          </div>
        </header>

        {/* HERO negro + naranja */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-900" />
          <div className="relative container mx-auto px-4 py-16 md:py-20 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                  🇪🇺 Europa
                </h1>
                <p className="mt-4 text-lg text-neutral-300">
                  Rutas para <span className="text-orange-400 font-semibold">estudiar</span>,{' '}
                  <span className="text-orange-400 font-semibold">trabajar</span>,{' '}
                  <span className="text-orange-400 font-semibold">EU Blue Card</span>,{' '}
                  <span className="text-orange-400 font-semibold">familia</span> y{' '}
                  <span className="text-orange-400 font-semibold">residencia</span>. Cada país, sus reglas — nosotros te
                  trazamos el camino.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#estudio"   className="rounded-full px-5 py-2.5 bg-orange-600 text-white font-semibold hover:bg-orange-700">Estudio</a>
                  <a href="#trabajo"   className="rounded-full px-5 py-2.5 bg-white/10 border border-neutral-700 text-neutral-100 font-semibold hover:bg-white/15">Trabajo</a>
                  <a href="#bluecard"  className="rounded-full px-5 py-2.5 bg-white/10 border border-neutral-700 text-neutral-100 font-semibold hover:bg-white/15">EU Blue Card</a>
                  <a href="#familia"   className="rounded-full px-5 py-2.5 bg-white/10 border border-neutral-700 text-neutral-100 font-semibold hover:bg-white/15">Familia</a>
                  <a href="#residencia" className="rounded-full px-5 py-2.5 bg-white/10 border border-neutral-700 text-neutral-100 font-semibold hover:bg-white/15">Residencia</a>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white">Rutas principales</h3>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-200">
                    <li className="rounded-xl border border-neutral-800 p-3">🎓 Estudio (admisión + visa)</li>
                    <li className="rounded-xl border border-neutral-800 p-3">💼 Trabajo cualificado</li>
                    <li className="rounded-xl border border-neutral-800 p-3">🟦 EU Blue Card</li>
                    <li className="rounded-xl border border-neutral-800 p-3">👨‍👩‍👧 Reagrupación</li>
                    <li className="rounded-xl border border-neutral-800 p-3">🏠 Residencia por tiempo</li>
                    <li className="rounded-xl border border-neutral-800 p-3">🛂 Estancias y visados Schengen</li>
                  </ul>
                  <div className="mt-5">
                    <Link href="/agendar" className="inline-flex items-center gap-2 rounded-xl bg-orange-600 text-white px-4 py-2.5 font-semibold hover:bg-orange-700">
                      Agendar consulta →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow naranja decorativo */}
          <div className="pointer-events-none absolute -bottom-10 -right-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        </section>

        {/* GRID de secciones (tema negro/naranja) */}
        <section className="container mx-auto px-4 py-14 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a id="estudio" className="sr-only" />
            <Card
              title="Estudio en la UE"
              badge="Universidad/College"
              desc="Carta de admisión, fondos y visa de estudiante."
              bullets={['Elección de país y programa', 'Requisitos reales', 'Ruta a residencia vía estudio']}
              cta={{ href: '/agendar', label: 'Explorar opciones' }}
              emoji="🎓"
              accent="orange"
            />

            <a id="trabajo" className="sr-only" />
            <Card
              title="Trabajo cualificado"
              badge="Empleo"
              desc="Ofertas, homologación de título y permisos."
              bullets={['Mapeo de roles/MIN', 'Validación de títulos', 'Permisos por país (DE, ES, PT, NL…)']}
              cta={{ href: '/agendar', label: 'Buscar estrategia' }}
              emoji="💼"
              accent="orange"
            />

            <a id="bluecard" className="sr-only" />
            <Card
              title="EU Blue Card"
              badge="Alta calificación"
              desc="Vía rápida para perfiles técnicos y profesionales."
              bullets={['Salarios mínimos por país', 'Contratos válidos', 'Familia + movilidad UE']}
              cta={{ href: '/agendar', label: 'Ver elegibilidad' }}
              emoji="🟦"
              accent="orange"
            />

            <a id="familia" className="sr-only" />
            <Card
              title="Reagrupación familiar"
              badge="Familia"
              desc="Cónyuge, pareja registrada e hijos."
              bullets={['Documentos probatorios', 'Tiempos y citas', 'Derechos y obligaciones']}
              cta={{ href: '/agendar', label: 'Iniciar proceso' }}
              emoji="👨‍👩‍👧"
              accent="orange"
            />

            <a id="residencia" className="sr-only" />
            <Card
              title="Residencia"
              badge="Largo plazo"
              desc="Por tiempo, trabajo o estudios completados."
              bullets={['Requisitos de permanencia', 'Exámenes/idioma', 'Renovaciones y PR']}
              cta={{ href: '/agendar', label: 'Trazar ruta' }}
              emoji="🏠"
              accent="orange"
            />

            <Card
              title="Schengen & especiales"
              badge="Visitas/Startups"
              desc="Visas de visita, nómadas digitales y emprendedores."
              bullets={['Riesgos reales de denegación', 'Pruebas de solvencia', 'Países pro-startup']}
              cta={{ href: '/agendar', label: 'Ver alternativas' }}
              emoji="🛫"
              accent="orange"
            />
          </div>
        </section>

        {/* PAGO (negro/naranja) */}
        <section className="bg-gradient-to-b from-neutral-50 to-white">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-neutral-900">Paga tu consulta o apoyo</h2>
              <p className="text-neutral-600 mt-1">Elige una opción o define un monto abierto.</p>

              <div className="mt-5 flex flex-wrap gap-3">
                {paymentOptions.map((o: PaymentOption) => (
                  <button
                    key={o.id}
                    onClick={() => onSelect(o.price, o.id === 'monto_abierto')}
                    className={`px-4 py-3 rounded-xl border shadow-sm ${
                      selectedPrice === o.price && !isCustom ? 'border-orange-600' : 'border-neutral-200'
                    } bg-white hover:shadow transition`}
                  >
                    <div className="font-semibold">{o.name}</div>
                    {o.price && <div className="text-sm text-neutral-600">${o.price}</div>}
                  </button>
                ))}
              </div>

              {isCustom && (
                <div className="mt-4 max-w-xs">
                  <label className="block text-sm font-medium mb-1">Monto (USD)</label>
                  <input
                    value={customAmount}
                    onChange={onCustomChange}
                    placeholder="10.00"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              )}

              <div className="mt-6">
                {okPay ? (
                  <div className="max-w-xs">
                    <p className="text-sm text-orange-700 mb-2">
                      Pagar: <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>
                    </p>
                    <DynamicPayPalButton
                      productPrice={amount}
                      onPaymentSuccess={onPayOk}
                      onPaymentError={(e: Error) => alert(e.message)}
                      paypalSdkLoaded={true}
                    />
                  </div>
                ) : (
                  <p className="text-neutral-600">Selecciona una opción de pago o define un monto.</p>
                )}
              </div>

              <div className="mt-6">
                <Link
                  href="/agendar"
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white px-4 py-2.5 font-semibold hover:bg-black"
                >
                  ¿Prefieres agendar primero? →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

/** ---------- Card reusable (tema negro/naranja) ---------- */
type CardProps = {
  title: string
  badge?: string
  desc: string
  bullets?: string[]
  cta?: { href: string; label: string }
  emoji?: string
  accent?: 'orange'
}

function Card({ title, badge, desc, bullets = [], cta, emoji = '✨', accent = 'orange' }: CardProps) {
  const badgeClasses =
    accent === 'orange'
      ? 'bg-orange-50 text-orange-700 border border-orange-100'
      : 'bg-neutral-100 text-neutral-700 border border-neutral-200'

  return (
    <div className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="text-4xl select-none">{emoji}</div>
        {badge && <span className={`text-xs font-semibold rounded-full px-3 py-1 ${badgeClasses}`}>{badge}</span>}
      </div>
      <h3 className="mt-4 text-xl font-bold text-neutral-900">{title}</h3>
      <p className="mt-2 text-neutral-700">{desc}</p>
      {bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-neutral-700 list-disc ml-5">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
      {cta && (
        <div className="mt-5">
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 text-orange-700 font-semibold group-hover:gap-3 transition"
          >
            {cta.label} <span>→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
