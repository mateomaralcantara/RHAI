// src/pages/destino/usa.tsx
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

export default function USAPage() {
  // --- PAGO (sin formulario de datos) ---
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const paymentOptions = [
    { id: 'consulta', name: 'Consulta Migratoria (EE. UU.)', price: '25.00' },
    { id: 'evaluacion_trabajo', name: 'Pre-chequeo Ruta Trabajo (H-1B/TN)', price: '100.00' },
    { id: 'donacion_fija', name: 'Donación Fija', price: '10.00' },
    { id: 'monto_abierto', name: 'Donación (Monto Abierto)', price: '' },
  ] as const
  type PaymentOption = (typeof paymentOptions)[number]

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

  const handlePaymentSuccess = (d: PayPalCaptureDetails) => {
    alert(`¡Gracias por tu pago, ${d?.payer?.name?.given_name || 'Cliente'}!`)
    setSelectedPrice(null)
    setCustomAmount('')
    setIsCustom(false)
  }
  const handlePaymentError = (err: Error) => alert(err.message)

  const finalAmount = (isCustom ? customAmount : selectedPrice) || ''
  const readyToPay = finalAmount !== '' && !isNaN(parseFloat(finalAmount)) && parseFloat(finalAmount) > 0

  return (
    <>
      <Head>
        <title>RHAI | 🇺🇸 Estados Unidos</title>
        <meta name="description" content="Opciones migratorias para Estados Unidos: trabajo, estudio, familia, residencia, asilo y más." />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Top bar */}
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-blue-800 font-extrabold text-xl">RHAI</Link>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#trabajo" className="text-blue-700 hover:underline">Trabajo</a>
              <a href="#estudio" className="text-blue-700 hover:underline">Estudio</a>
              <a href="#familia" className="text-blue-700 hover:underline">Familia</a>
              <a href="#residencia" className="text-blue-700 hover:underline">Residencia</a>
              <a href="#asilo" className="text-blue-700 hover:underline">Asilo</a>
              <a href="#otros" className="text-blue-700 hover:underline">Otros</a>
            </nav>
            <Link href="/" className="text-blue-700 hover:underline">← Volver</Link>
          </div>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
          <div className="container relative mx-auto px-4 py-16 md:py-20 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-900">
                  🇺🇸 Estados Unidos
                </h1>
                <p className="mt-4 text-lg text-gray-700">
                  Elige tu ruta: <span className="font-semibold">Trabajo</span>, <span className="font-semibold">Estudio</span>,{' '}
                  <span className="font-semibold">Familia</span>, <span className="font-semibold">Residencia</span> o <span className="font-semibold">Asilo</span>.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#trabajo" className="rounded-full px-5 py-2.5 bg-blue-700 text-white font-semibold hover:bg-blue-800">Trabajo</a>
                  <a href="#estudio" className="rounded-full px-5 py-2.5 bg-white border border-blue-200 text-blue-800 font-semibold hover:shadow">Estudio</a>
                  <a href="#familia" className="rounded-full px-5 py-2.5 bg-white border border-blue-200 text-blue-800 font-semibold hover:shadow">Familia</a>
                  <a href="#residencia" className="rounded-full px-5 py-2.5 bg-white border border-blue-200 text-blue-800 font-semibold hover:shadow">Residencia</a>
                  <a href="#asilo" className="rounded-full px-5 py-2.5 bg-white border border-blue-200 text-blue-800 font-semibold hover:shadow">Asilo</a>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border bg-white shadow-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-blue-900">Rutas principales</h3>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <li className="rounded-xl border p-3">💼 H-1B / TN (profesionales)</li>
                    <li className="rounded-xl border p-3">🔁 L-1 (transferencias intraempresa)</li>
                    <li className="rounded-xl border p-3">🎓 F-1 / M-1 (estudio)</li>
                    <li className="rounded-xl border p-3">👨‍👩‍👧 Familia (Ajuste/Consular)</li>
                    <li className="rounded-xl border p-3">🏆 EB-1/EB-2/NIW/EB-3</li>
                    <li className="rounded-xl border p-3">🛡️ Asilo</li>
                  </ul>
                  <div className="mt-5">
                    <Link href="/agendar" className="inline-flex items-center gap-2 rounded-xl bg-blue-700 text-white px-4 py-2.5 font-semibold hover:bg-blue-800">
                      Agendar consulta rápida →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GRID MODERNO DE OPCIONES */}
        <section className="container mx-auto px-4 py-14 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Trabajo */}
            <a id="trabajo" className="sr-only" />
            <Card
              title="Trabajo (H-1B, TN, L-1)"
              badge="Profesionales"
              desc="Evaluamos elegibilidad, estrategia de empleador/patrocinio y tiempos."
              bullets={['Perfil y títulos (ECA si aplica)', 'IELTS/inglés laboral (recomendado)', 'Cronograma y riesgos']}
              cta={{ href: '/agendar', label: 'Quiero esta ruta' }}
              emoji="💼"
            />
            {/* Estudio */}
            <a id="estudio" className="sr-only" />
            <Card
              title="Estudio (F-1/M-1)"
              badge="Educación"
              desc="Universidades, community colleges y vías a trabajo opcional (OPT)."
              bullets={['Admisión y I-20', 'Fondos y seguro', 'OPT/CPT estrategia']}
              cta={{ href: '/agendar', label: 'Explorar estudio' }}
              emoji="🎓"
            />
            {/* Familia */}
            <a id="familia" className="sr-only" />
            <Card
              title="Familia"
              badge="Reunificación"
              desc="Peticiones por cónyuge, padres, hijos o hermanos ciudadanos o residentes."
              bullets={['Evidencia de relación', 'Ajuste vs. consular', 'Affidavit of Support']}
              cta={{ href: '/agendar', label: 'Reunificar familia' }}
              emoji="👨‍👩‍👧‍👦"
            />
            {/* Residencia */}
            <a id="residencia" className="sr-only" />
            <Card
              title="Residencia (EB-1/EB-2/NIW/EB-3)"
              badge="Residencia permanente"
              desc="Vías basadas en empleo o méritos (incl. NIW sin oferta laboral)."
              bullets={['Elegibilidad por méritos', 'Strategy letter', 'Evidencia clave']}
              cta={{ href: '/agendar', label: 'Evaluar green card' }}
              emoji="🏆"
            />
            {/* Asilo */}
            <a id="asilo" className="sr-only" />
            <Card
              title="Asilo"
              badge="Protección"
              desc="Análisis de riesgo, evidencias y consistencia del testimonio."
              bullets={['Línea de tiempo', 'Pruebas documentales', 'Preparación de entrevista']}
              cta={{ href: '/agendar', label: 'Evaluar asilo' }}
              emoji="🛡️"
            />
            {/* Otros */}
            <a id="otros" className="sr-only" />
            <Card
              title="Otros (J-1, O-1, B-1/B-2)"
              badge="Casos especiales"
              desc="Rutas temporales, talentos extraordinarios, visitas y conferencias."
              bullets={['Requisitos específicos', 'Riesgos y estancias', 'Plan a medida']}
              cta={{ href: '/agendar', label: 'Ver alternativas' }}
              emoji="🧭"
            />
          </div>
        </section>

        {/* PAGO */}
        <section className="bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="bg-white rounded-3xl border shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-blue-900">Paga tu consulta o apoyo</h2>
              <p className="text-gray-600 mt-1">
                Elige una opción o define un monto abierto.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {paymentOptions.map((o: PaymentOption) => (
                  <button
                    key={o.id}
                    onClick={() => onSelect(o.price, o.id === 'monto_abierto')}
                    className={`px-4 py-3 rounded-xl border shadow-sm ${
                      selectedPrice === o.price && !isCustom ? 'border-blue-600' : 'border-gray-200'
                    } bg-white hover:shadow`}
                  >
                    <div className="font-semibold">{o.name}</div>
                    {o.price && <div className="text-sm text-gray-600">${o.price}</div>}
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
                {readyToPay ? (
                  <div className="max-w-xs">
                    <p className="text-sm text-blue-700 mb-2">
                      Pagar: <span className="font-bold">${parseFloat(finalAmount).toFixed(2)}</span>
                    </p>
                    <DynamicPayPalButton
                      productPrice={finalAmount}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      paypalSdkLoaded={true}
                    />
                  </div>
                ) : (
                  <p className="text-gray-600">Selecciona una opción de pago o define un monto.</p>
                )}
              </div>

              <div className="mt-6">
                <Link
                  href="/agendar"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 text-white px-4 py-2.5 font-semibold hover:bg-blue-800"
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

/** ---------- UI CARD ---------- */
type CardProps = {
  title: string
  badge?: string
  desc: string
  bullets?: string[]
  cta?: { href: string; label: string }
  emoji?: string
}

function Card({ title, badge, desc, bullets = [], cta, emoji = '⭐' }: CardProps) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="text-4xl select-none">{emoji}</div>
        {badge && (
          <span className="text-xs font-semibold rounded-full bg-blue-50 text-blue-700 px-3 py-1 border border-blue-100">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-bold text-blue-900">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
      {bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc ml-5">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
      {cta && (
        <div className="mt-5">
          <Link href={cta.href} className="inline-flex items-center gap-2 text-blue-700 font-semibold group-hover:gap-3 transition">
            {cta.label} <span>→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
