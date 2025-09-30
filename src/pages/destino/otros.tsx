// src/pages/destino/otros.tsx
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMemo, useState, type ChangeEvent } from 'react'

interface PayPalCaptureDetails {
  payer?: { name?: { given_name?: string } }
  id?: string
  status?: string
}

const DynamicPayPalButtonOT = dynamic(() => import('../../components/PayPalButton'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-600">Cargando pasarela de pago…</p>,
})

// --- Catálogo de países con temas fuertes e imponentes ---
type Country = {
  id: string
  name: string
  emoji: string
  // clases ya “materializadas” para que Tailwind no purgue (no dinámicas)
  heroClass: string
  accentText: string
  accentBorder: string
  accentButton: string
  accentButtonHover: string
  chipClass: string
  pitch: string
}

const COUNTRIES: Country[] = [
  {
    id: 'mx',
    name: 'México',
    emoji: '🇲🇽',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-emerald-900 to-red-900',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500',
    accentButton: 'bg-emerald-600',
    accentButtonHover: 'hover:bg-emerald-700',
    chipClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    pitch: 'Estudio, trabajo, emprendimiento y residencia temporal/permanente.',
  },
  {
    id: 'co',
    name: 'Colombia',
    emoji: '🇨🇴',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-blue-900 to-amber-800',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500',
    accentButton: 'bg-amber-600',
    accentButtonHover: 'hover:bg-amber-700',
    chipClass: 'bg-amber-50 text-amber-800 border-amber-200',
    pitch: 'Visa de estudiante, trabajo cualificado y opciones de residencia.',
  },
  {
    id: 'ar',
    name: 'Argentina',
    emoji: '🇦🇷',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-sky-900 to-sky-700',
    accentText: 'text-sky-400',
    accentBorder: 'border-sky-500',
    accentButton: 'bg-sky-600',
    accentButtonHover: 'hover:bg-sky-700',
    chipClass: 'bg-sky-50 text-sky-800 border-sky-200',
    pitch: 'Estudios superiores, trabajo y residencia temporaria.',
  },
  {
    id: 'cl',
    name: 'Chile',
    emoji: '🇨🇱',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-blue-900 to-red-900',
    accentText: 'text-red-400',
    accentBorder: 'border-red-500',
    accentButton: 'bg-red-600',
    accentButtonHover: 'hover:bg-red-700',
    chipClass: 'bg-red-50 text-red-800 border-red-200',
    pitch: 'Visas de trabajo, profesional y reunificación familiar.',
  },
  {
    id: 'pe',
    name: 'Perú',
    emoji: '🇵🇪',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-red-900 to-rose-900',
    accentText: 'text-rose-400',
    accentBorder: 'border-rose-500',
    accentButton: 'bg-rose-600',
    accentButtonHover: 'hover:bg-rose-700',
    chipClass: 'bg-rose-50 text-rose-800 border-rose-200',
    pitch: 'Opciones de estudio, trabajo y residencia por vínculo.',
  },
  {
    id: 'br',
    name: 'Brasil',
    emoji: '🇧🇷',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-emerald-900 to-yellow-700',
    accentText: 'text-lime-400',
    accentBorder: 'border-lime-500',
    accentButton: 'bg-lime-600',
    accentButtonHover: 'hover:bg-lime-700',
    chipClass: 'bg-lime-50 text-lime-800 border-lime-200',
    pitch: 'Trabajo cualificado, emprendimiento y residencia.',
  },
  {
    id: 'cr',
    name: 'Costa Rica',
    emoji: '🇨🇷',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-red-900 to-blue-900',
    accentText: 'text-blue-300',
    accentBorder: 'border-blue-500',
    accentButton: 'bg-blue-600',
    accentButtonHover: 'hover:bg-blue-700',
    chipClass: 'bg-blue-50 text-blue-800 border-blue-200',
    pitch: 'Programas de nómadas digitales y opciones laborales.',
  },
  {
    id: 'pa',
    name: 'Panamá',
    emoji: '🇵🇦',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-indigo-900 to-red-900',
    accentText: 'text-indigo-300',
    accentBorder: 'border-indigo-500',
    accentButton: 'bg-indigo-600',
    accentButtonHover: 'hover:bg-indigo-700',
    chipClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    pitch: 'Residencia por inversión, trabajo y categorías especiales.',
  },
  {
    id: 'do',
    name: 'Rep. Dominicana',
    emoji: '🇩🇴',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-blue-900 to-rose-900',
    accentText: 'text-fuchsia-300',
    accentBorder: 'border-fuchsia-500',
    accentButton: 'bg-fuchsia-600',
    accentButtonHover: 'hover:bg-fuchsia-700',
    chipClass: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
    pitch: 'Opciones de residencia y reunificación familiar.',
  },
  {
    id: 'uy',
    name: 'Uruguay',
    emoji: '🇺🇾',
    heroClass: 'bg-gradient-to-br from-neutral-950 via-slate-900 to-sky-900',
    accentText: 'text-slate-300',
    accentBorder: 'border-slate-500',
    accentButton: 'bg-slate-700',
    accentButtonHover: 'hover:bg-slate-800',
    chipClass: 'bg-slate-100 text-slate-800 border-slate-200',
    pitch: 'Residencia, trabajo calificado y estabilidad.',
  },
]

const paymentOptions = [
  { id: 'consulta', name: 'Consulta Migratoria (Otros países)', price: '25.00' },
  { id: 'evaluacion', name: 'Pre-chequeo de perfil', price: '70.00' },
  { id: 'donacion_fija', name: 'Donación Fija', price: '10.00' },
  { id: 'monto_abierto', name: 'Donación (Monto Abierto)', price: '' },
] as const
type PaymentOption = (typeof paymentOptions)[number]

export default function OtrosPaisesPage() {
  // País seleccionado
  const [countryId, setCountryId] = useState<string>('mx')
  const country = useMemo(
    () => COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0],
    [countryId]
  )

  // Pago
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const onSelectPrice = (price: string, custom: boolean) => {
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

  // Países “destacados” para pills
  const featured = COUNTRIES.slice(0, 8)

  return (
    <>
      <Head>
        <title>RHAI | 🌎 Otros países</title>
        <meta name="description" content="Asesoría para LATAM y otros destinos: estudio, trabajo, residencia." />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Header neutro */}
        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-neutral-900 font-extrabold text-xl tracking-tight">RHAI</Link>
            <Link href="/" className="text-neutral-700 hover:text-neutral-900">← Volver</Link>
          </div>
        </header>

        {/* HERO con gradiente brutal por país */}
        <section className="relative overflow-hidden">
          <div className={`absolute inset-0 ${country.heroClass}`} />
          <div className="relative container mx-auto px-4 py-12 md:py-16 max-w-6xl text-white">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                  {country.emoji} {country.name}
                </h1>
                <p className="mt-3 text-lg text-neutral-200">
                  {country.pitch}
                </p>
              </div>

              {/* Barra desplegable: países de América */}
              <div className="w-full md:w-80">
                <label className="block text-sm font-semibold mb-2 text-neutral-200">Elige un país</label>
                <div className="relative">
                  <select
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    className="w-full appearance-none rounded-2xl bg-white/10 border border-white/30 backdrop-blur px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id} className="text-neutral-900">
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/80">▼</span>
                </div>
              </div>
            </div>

            {/* Pills de selección rápida */}
            <div className="mt-6 overflow-auto">
              <div className="flex gap-2 min-w-max">
                {featured.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCountryId(c.id)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      c.id === countryId ? 'bg-white text-neutral-900 border-white' : c.chipClass
                    }`}
                  >
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/agendar"
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white ${country.accentButton} ${country.accentButtonHover}`}
              >
                Agendar consulta →
              </Link>
            </div>
          </div>

          {/* glow decorativo */}
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </section>

        {/* Secciones rápidas por temática (se mantienen neutrales con acento del país) */}
        <section className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Estudio"
              desc="Universidades, becas y visados de estudiante."
              bullets={['Carta de admisión', 'Fondos y seguros', 'Ruta a residencia']}
              emoji="🎓"
              accentBorder={country.accentBorder}
              accentText={country.accentText}
            />
            <Card
              title="Trabajo"
              desc="Ofertas, permisos y homologación de títulos."
              bullets={['Perfiles demandados', 'Permisos reales', 'Vías por país']}
              emoji="💼"
              accentBorder={country.accentBorder}
              accentText={country.accentText}
            />
            <Card
              title="Familia"
              desc="Reagrupación y permisos para tu círculo cercano."
              bullets={['Documentos clave', 'Tiempos de trámite', 'Derechos y beneficios']}
              emoji="👨‍👩‍👧"
              accentBorder={country.accentBorder}
              accentText={country.accentText}
            />
            <Card
              title="Residencia"
              desc="Temporal, permanente o por inversión (según país)."
              bullets={['Requisitos legales', 'Renovaciones', 'Camino a ciudadanía']}
              emoji="🏠"
              accentBorder={country.accentBorder}
              accentText={country.accentText}
            />
            <Card
              title="Nómadas digitales"
              desc="Visas especiales y condiciones remotas."
              bullets={['Elegibilidad', 'Ingresos mínimos', 'Países pro-remoto']}
              emoji="🧑‍💻"
              accentBorder={country.accentBorder}
              accentText={country.accentText}
            />
            <Card
              title="Emprendimiento"
              desc="Startups, inversión y programas especiales."
              bullets={['Sectores objetivo', 'Requisitos de capital', 'Beneficios fiscales']}
              emoji="🚀"
              accentBorder={country.accentBorder}
              accentText={country.accentText}
            />
          </div>
        </section>

        {/* Pago con acentos del país */}
        <section className="bg-gradient-to-b from-neutral-50 to-white">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-neutral-900">Paga tu consulta o apoyo</h2>
              <p className="text-neutral-600 mt-1">Elige una opción o define un monto abierto.</p>

              <div className="mt-5 flex flex-wrap gap-3">
                {paymentOptions.map((o: PaymentOption) => (
                  <button
                    key={o.id}
                    onClick={() => onSelectPrice(o.price, o.id === 'monto_abierto')}
                    className={`px-4 py-3 rounded-xl border shadow-sm bg-white hover:shadow transition ${
                      selectedPrice === o.price && !isCustom ? country.accentBorder : 'border-neutral-200'
                    }`}
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
                    <p className={`text-sm mb-2 ${country.accentText}`}>
                      Pagar: <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>
                    </p>
                    <DynamicPayPalButtonOT
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
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white ${country.accentButton} ${country.accentButtonHover}`}
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

/** ---------- Tarjeta reutilizable con acento ---------- */
type CardProps = {
  title: string
  desc: string
  bullets?: string[]
  emoji?: string
  accentBorder: string
  accentText: string
}
function Card({ title, desc, bullets = [], emoji = '✨', accentBorder, accentText }: CardProps) {
  return (
    <div className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="text-3xl select-none">{emoji}</div>
        <span className={`text-xs font-semibold rounded-full px-3 py-1 border ${accentBorder} ${accentText} bg-white`}>
          Destacado
        </span>
      </div>
      <h3 className="mt-4 text-xl font-bold text-neutral-900">{title}</h3>
      <p className="mt-2 text-neutral-700">{desc}</p>
      {bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-neutral-700 list-disc ml-5">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  )
}
