// src/pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import type { ReactNode, FormEvent } from 'react'

type Option = { id: 'usa' | 'canada' | 'europa' | 'otros'; label: string; emoji: string }

const OPTIONS: readonly Option[] = [
  { id: 'usa',    label: 'Estados Unidos', emoji: '🇺🇸' },
  { id: 'canada', label: 'Canadá',         emoji: '🇨🇦' },
  { id: 'europa', label: 'Europa',         emoji: '🇪🇺' },
  { id: 'otros',  label: 'Otros países',   emoji: '🌎'  },
] as const

type OptId = Option['id']

const SEARCH_ALIASES: Record<OptId, string[]> = {
  usa:    ['usa','estados unidos','eeuu','ee.uu','u.s.a','us'],
  canada: ['canada','canadá','ca'],
  europa: ['europa','europe','ue','union europea','unión europea'],
  otros:  ['otros','otros paises','otros países','resto','latam','sudamerica','sudamérica','otra'],
}

// normaliza: quita acentos y a minúsculas
const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

const ALERT_KEY = 'searchAlertSent'
const PROMPT_KEY = 'tawkPromptShown'

type GradientFrameProps = { className?: string; children: ReactNode }
const GradientFrame = ({ className = '', children }: GradientFrameProps) => (
  <div
    className={[
      'p-[16px]',
      'bg-[conic-gradient(at_50%_50%,#ff006a_0deg,#ff9d00_55deg,#00d1ff_120deg,#7c3aed_180deg,#10b981_240deg,#ef4444_300deg,#ff006a_360deg)]',
      'rounded-none shadow-[0_12px_40px_rgba(17,24,39,0.15)]',
      className,
    ].join(' ')}
  >
    <div className="rounded-none bg-white ring-2 ring-black/5">{children}</div>
  </div>
)

export default function Home() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const [countMsg, setCountMsg] = useState('') // aria-live
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ---- Alarma + Tawk on search (debounced) ----
  const fireSearchEvents = useCallback((term: string) => {
    if (typeof window === 'undefined') return
    try {
      if (!sessionStorage.getItem(ALERT_KEY)) {
        sessionStorage.setItem(ALERT_KEY, '1')
        fetch('/api/owner-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: term, url: window.location.href, ts: Date.now() }),
        }).catch(() => {})
      }

      const tryTawk = (tries = 10) => {
        const T: any = (window as any).Tawk_API
        if (T && typeof T.addEvent === 'function') {
          try {
            T.addEvent('search_started', { query: term })
            if (typeof T.maximize === 'function') T.maximize()
          } catch {}
        } else if (tries > 0) {
          setTimeout(() => tryTawk(tries - 1), 400)
        }
      }
      tryTawk()
    } catch {}
  }, [])

  const handleSearchChange = (value: string) => {
    setQ(value)
    const v = value.trim()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.length < 2) return
    debounceRef.current = setTimeout(() => fireSearchEvents(v), 700)
  }

  // Sugerencias filtradas
  const suggestions = useMemo(() => {
    const s = norm(q)
    if (!s) return OPTIONS
    return OPTIONS.filter(o => {
      const label = norm(o.label)
      const aliases = SEARCH_ALIASES[o.id].map(norm)
      return label.includes(s) || aliases.some(a => a.includes(s) || s.includes(a))
    })
  }, [q])

  // aria-live con recuento
  useEffect(() => {
    setCountMsg(`${suggestions.length} resultado${suggestions.length === 1 ? '' : 's'}`)
  }, [suggestions.length])

  const go = useCallback((id: OptId) => {
    router.push(`/destino/${id}`)
  }, [router])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const first = suggestions[0]
    if (first) go(first.id)
  }

  // Prefetch destinos
  useEffect(() => {
    OPTIONS.forEach(o => router.prefetch(`/destino/${o.id}`))
  }, [router])

  // Limpieza del debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Auto-prompt Tawk tras 15s (una vez por sesión)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(PROMPT_KEY)) return
    const t = window.setTimeout(() => {
      try {
        const T: any = (window as any).Tawk_API
        if (T?.addEvent) T.addEvent('auto_prompt', { page: 'home' })
        if (T?.maximize) T.maximize()
        sessionStorage.setItem(PROMPT_KEY, '1')
      } catch {}
    }, 15000)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <>
      <Head>
        <title>RHAI | Elige tu destino</title>
        <meta
          name="description"
          content="Elige tu destino migratorio y entra directo a la página específica: Estados Unidos, Canadá, Europa u otros países."
        />
        <link rel="canonical" href="https://tu-dominio.com/" />
        <meta name="robots" content="index,follow" />
      </Head>

      {/* Todo hipercentrado, con ancho total y card central MUY ancha */}
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef6ff] via-white to-white px-8 py-20">
        <div className="w-full max-w-[1400px]">
          {/* Card central con marco gordo */}
          <GradientFrame>
            <div className="px-10 py-14 md:px-16 md:py-16">
              <div className="text-center">
                <h1 className="text-[38px] md:text-[56px] leading-[1.05] font-extrabold text-blue-900 tracking-tight">
                  Elige tu destino
                </h1>
                <p className="text-gray-700 mt-4 text-lg md:text-xl">
                  Clic en una opción y entras directo. Sin formularios.
                </p>
              </div>

              {/* Buscador centrado con su propio marco ultra-grueso */}
              <div className="mt-10 max-w-4xl mx-auto">
                <form onSubmit={onSubmit} role="search" aria-label="Buscar destino">
                  <GradientFrame className="shadow-xl">
                    <label htmlFor="search" className="sr-only">Buscar destino</label>
                    <input
                      id="search"
                      value={q}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="Busca: Estados Unidos, Canadá, Europa u Otros…"
                      className="w-full text-2xl md:text-3xl px-6 py-6 outline-none"
                      aria-autocomplete="list"
                      aria-expanded={focused}
                    />
                  </GradientFrame>
                </form>
                {/* anuncio accesible del recuento */}
                <p aria-live="polite" className="sr-only">{countMsg}</p>
              </div>

              {/* Grid muy amplia, tarjetas con marco grueso */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {suggestions.map((o) => (
                  <Link key={o.id} href={`/destino/${o.id}`} className="block group focus:outline-none">
                    <GradientFrame className="transition-transform duration-200 group-hover:-translate-y-0.5">
                      <div className="p-10 text-center">
                        <div className="text-7xl md:text-8xl mb-4 select-none">{o.emoji}</div>
                        <div className="text-2xl md:text-3xl font-bold text-blue-800">{o.label}</div>
                        <div className="text-sm md:text-base text-gray-500 mt-1">
                          Abrir página de {o.label.toLowerCase()}
                        </div>
                        <div className="mt-6 inline-flex items-center gap-2 text-blue-700 font-semibold text-lg md:text-xl">
                          Ver más <span>→</span>
                        </div>
                      </div>
                    </GradientFrame>
                  </Link>
                ))}
              </div>
            </div>
          </GradientFrame>
        </div>
      </main>
    </>
  )
}
