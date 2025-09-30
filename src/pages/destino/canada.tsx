// src/pages/destino/canada.tsx
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, type ChangeEvent } from 'react'

interface PayPalCaptureDetails {
  payer?: { name?: { given_name?: string } }
  id?: string
  status?: string
}

const DynamicPayPalButtonCA = dynamic(() => import('../../components/PayPalButton'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-600">Cargando pasarela de pago…</p>,
})

export default function CanadaPage() {
  // --- ESTADO PAGO (sin formulario de datos) ---
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const paymentOptions = [
    { id: 'consulta',       name: 'Consulta Migratoria (Canadá)',  price: '25.00' },
    { id: 'express_entry',  name: 'Pre-chequeo Express Entry',     price: '90.00' },
    { id: 'donacion_fija',  name: 'Donación Fija',                 price: '10.00' },
    { id: 'monto_abierto',  name: 'Donación (Monto Abierto)',      price: '' },
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
        <title>RHAI | 🇨🇦 Canadá</title>
        <meta name="description" content="Asesoría para Canadá: Express Entry, estudio, trabajo y residencia." />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Top bar */}
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-red-800 font-extrabold text-xl">RHAI</Link>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#express" className="text-red-700 hover:underline">Express Entry</a>
              <a href="#estudio"  className="text-red-700 hover:underline">Estudio</a>
              <a href="#trabajo"  className="text-red-700 hover:underline">Trabajo</a>
              <a href="#pnp"      className="text-red-700 hover:underline">PNP</a>
              <a href="#pr"       className="text-red-700 hover:underline">Residencia</a>
              <a href="#otros"    className="text-red-700 hover:underline">Otros</a>
            </nav>
            <Link href="/" className="text-red-700 hover:underline">← Volver</Link>
          </div>
        </header>

        {/* HERO rojo 🍁 */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-rose-100" />
          <div className="container relative mx-auto px-4 py-16 md:py-20 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-red-900">
                  🇨🇦 Canadá
                </h1>
                <p className="mt-4 text-lg text-gray-700">
                  Elige tu ruta: <span className="font-semibold">Express Entry</span>,{' '}
                  <span className="font-semibold">Estudio</span>,{' '}
                  <span className="font-semibold">Trabajo</span>,{' '}
                  <span className="font-semibold">PNP</span> o{' '}
                  <span className="font-semibold">Residencia</span>.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#express" className="rounded-full px-5 py-2.5 bg-red-700 text-white font-semibold hover:bg-red-800">Express Entry</a>
                  <a href="#estudio" className="rounded-full px-5 py-2.5 bg-white border border-rose-200 text-red-800 font-semibold hover:shadow">Estudio</a>
                  <a href="#trabajo" className="rounded-full px-5 py-2.5 bg-white border border-rose-200 text-red-800 font-semibold hover:shadow">Trabajo</a>
                  <a href="#pnp"     className="rounded-full px-5 py-2.5 bg-white border border-rose-200 text-red-800 font-semibold hover:shadow">PNP</a>
                  <a href="#pr"      className="rounded-full px-5 py-2.5 bg-white border border-rose-200 text-red-800 font-semibold hover:shadow">Residencia</a>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border bg-white shadow-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-red-900">Rutas principales</h3>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <li className="rounded-xl border p-3">🧮 Express Entry (CRS)</li>
                    <li className="rounded-xl border p-3">📝 ECA + IELTS/CELPIP</li>
                    <li className="rounded-xl border p-3">🎓 Estudio + PGWP</li>
                    <li className="rounded-xl border p-3">🏞️ PNP provinciales</li>
                    <li className="rounded-xl border p-3">💼 Trabajo calificado (LMIA/TFWP)</li>
                    <li className="rounded-xl border p-3">🏠 PR por familia</li>
                  </ul>
                  <div className="mt-5">
                    <Link href="/agendar" className="inline-flex items-center gap-2 rounded-xl bg-red-700 text-white px-4 py-2.5 font-semibold hover:bg-red-800">
                      Agendar consulta →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GRID de secciones (tema rojo) */}
        <section className="container mx-auto px-4 py-14 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a id="express" className="sr-only" />
            <Card
              title="Express Entry"
              badge="Sistema CRS"
              desc="Perfil, ECA, idioma y estrategia para maximizar puntaje."
              bullets={['Cálculo CRS realista', 'Estrategias por edad/estudios', 'Opciones para subir score']}
              cta={{ href: '/agendar', label: 'Optimizar CRS' }}
              emoji="🧮"
            />

            <a id="estudio" className="sr-only" />
            <Card
              title="Estudio + PGWP"
              badge="Educación"
              desc="College/Universidad, carta de aceptación y plan de fondos."
              bullets={['Carta de aceptación', 'Prueba de fondos', 'Ruta a PR vía PGWP']}
              cta={{ href: '/agendar', label: 'Explorar estudio' }}
              emoji="🎓"
            />

            <a id="trabajo" className="sr-only" />
            <Card
              title="Trabajo calificado"
              badge="Empleo"
              desc="Ofertas con LMIA/TFWP, NOC TEER y trayectoria a PR."
              bullets={['Análisis NOC', 'LMIA vs. exenciones', 'Plan hacia PR']}
              cta={{ href: '/agendar', label: 'Buscar estrategia' }}
              emoji="💼"
            />

            <a id="pnp" className="sr-only" />
            <Card
              title="PNP provinciales"
              badge="Provincias"
              desc="Programas alineados a tu perfil en ON, BC, AB, SK, etc."
              bullets={['Requisitos por provincia', 'Streams activos', 'Probabilidad realista']}
              cta={{ href: '/agendar', label: 'Ver PNPs' }}
              emoji="🏞️"
            />

            <a id="pr" className="sr-only" />
            <Card
              title="Residencia permanente"
              badge="PR"
              desc="EE, PNP, familia y experiencias canadienses."
              bullets={['Rutas a PR', 'Documentación clave', 'Tiempos estimados']}
              cta={{ href: '/agendar', label: 'Evaluar PR' }}
              emoji="🏠"
            />

            <a id="otros" className="sr-only" />
            <Card
              title="Otros (IEC, visitas)"
              badge="Especiales"
              desc="Working Holiday (IEC), visitas, conferencias y más."
              bullets={['Elegibilidad IEC', 'Riesgos de visita', 'Planes alternativos']}
              cta={{ href: '/agendar', label: 'Ver alternativas' }}
              emoji="🧭"
            />
          </div>
        </section>

        {/* PAGO (tema rojo) */}
        <section className="bg-gradient-to-b from-rose-50 to-white">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="bg-white rounded-3xl border shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-red-900">Paga tu consulta o apoyo</h2>
              <p className="text-gray-600 mt-1">Elige una opción o define un monto abierto.</p>

              <div className="mt-5 flex flex-wrap gap-3">
                {paymentOptions.map((o: PaymentOption) => (
                  <button
                    key={o.id}
                    onClick={() => onSelect(o.price, o.id === 'monto_abierto')}
                    className={`px-4 py-3 rounded-xl border shadow-sm ${
                      selectedPrice === o.price && !isCustom ? 'border-red-600' : 'border-gray-200'
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
                {okPay ? (
                  <div className="max-w-xs">
                    <p className="text-sm text-red-700 mb-2">
                      Pagar: <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>
                    </p>
                    <DynamicPayPalButtonCA
                      productPrice={amount}
                      onPaymentSuccess={onPayOk}
                      onPaymentError={(e: Error) => alert(e.message)}
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
                  className="inline-flex items-center gap-2 rounded-xl bg-red-700 text-white px-4 py-2.5 font-semibold hover:bg-red-800"
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

/** ---------- UI CARD (tema rojo) ---------- */
type CardProps = {
  title: string
  badge?: string
  desc: string
  bullets?: string[]
  cta?: { href: string; label: string }
  emoji?: string
}

function Card({ title, badge, desc, bullets = [], cta, emoji = '🍁' }: CardProps) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="text-4xl select-none">{emoji}</div>
        {badge && (
          <span className="text-xs font-semibold rounded-full bg-rose-50 text-red-700 px-3 py-1 border border-rose-100">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-bold text-red-900">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
      {bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc ml-5">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
      {cta && (
        <div className="mt-5">
          <Link href={cta.href} className="inline-flex items-center gap-2 text-red-700 font-semibold group-hover:gap-3 transition">
            {cta.label} <span>→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
