<<<<<<< HEAD
// pages/index.tsx

import Head from 'next/head';
import { useState, ChangeEvent } from 'react'; // Eliminado useEffect
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// --- SE HAN ELIMINADO TODAS LAS IMPORTACIONES DEL CHAT NATIVO ANTERIOR ---
// import ChatButton from '../components/ChatButton';
// import ChatWindow from '../components/ChatWindow';
// import { ClientConversation, ClientMessage } from '../src/types/chat'; // Eliminado


// Definición de tipos para los detalles de captura de PayPal
interface PayPalCaptureDetailsForIndex {
  payer: {
    name: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
  };
  id?: string;
  status?: string;
}

// Tipo para las props que recibe Home, incluyendo paypalSdkLoaded
interface HomePageProps {
  paypalSdkLoaded: boolean;
}

// Tipo para los elementos de FAQ
interface FAQItem {
  question: string;
  answer: string;
}

const DynamicPayPalButton = dynamic(() => import('../components/PayPalButton'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-600">Cargando botón de pago de PayPal...</p>,
});

// Define faqItems FUERA del componente Home para evitar el error de referencia antes de la definición
const faqItems: FAQItem[] = [
  {
    question: '¿Cuánto tiempo tarda un proceso migratorio?',
    answer: 'El tiempo varía significativamente según el país, el tipo de visado y las circunstancias individuales. Durante tu consulta gratuita, te daremos una estimación más precisa.',
  },
  {
    question: '¿RHAI garantiza la aprobación del visado?',
    answer: 'Ninguna asesoría puede garantizar la aprobación de un visado, ya que la decisión final recae en las autoridades migratorias. Sin embargo, en RHAI maximizamos tus posibilidades al asegurar que tu solicitud cumpla con todos los requisitos y se presente de la manera más sólida posible.',
  },
  {
    question: '¿Qué tipo de casos migratorios manejan?',
    answer: 'En RHAI manejamos una amplia gama de casos, incluyendo visados de trabajo, estudio, reunificación familiar, residencia permanente y ciudadanía. Te invitamos a agendar una consulta para evaluar tu situación específica.',
  },
  {
    question: '¿Ofrecen asesoría en otros idiomas además del español?',
    answer: 'Nuestra especialidad es el apoyo a la comunidad hispana, por lo que nuestra comunicación principal es en español. Sin embargo, contamos con recursos para asistirte si necesitas soporte en otros idiomas.',
  },
];

export default function Home({ paypalSdkLoaded }: HomePageProps) {
  const [isMobileMenuOpen, setIsMobileMenuMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedProductPrice, setSelectedProductPrice] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomAmountSelected, setIsCustomAmountSelected] = useState<boolean>(false);

  // --- SE HA ELIMINADO TODO EL ESTADO Y LÓGICA PARA EL CHAT EN VIVO NATIVO ---
  // const [isChatOpen, setIsChatOpen] = useState(false);
  // const [userId, setUserId] = useState<string>('');
  // const [conversationId, setConversationId] = useState<string>('');

  // SE HA ELIMINADO EL useEffect RELACIONADO CON EL CHAT NATIVO
  // useEffect(() => {
  //   let currentUserId = localStorage.getItem('rhai_chat_userId');
  //   if (!currentUserId) {
  //     currentUserId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  //     localStorage.setItem('rhai_chat_userId', currentUserId);
  //   }
  //   setUserId(currentUserId);

  //   const fetchOrCreateConversation = async (id: string) => {
  //     try {
  //       const res = await fetch(`/api/chat/${id}`);
  //       if (!res.ok) {
  //         throw new Error(`Error HTTP! estado: ${res.status}`);
  //       }
  //       const data = await res.json();
  //       setConversationId(data.conversationId);
  //     } catch (error) {
  //       console.error('Error al obtener o crear conversación:', error);
  //     }
  //   };

  //   if (currentUserId) {
  //     fetchOrCreateConversation(currentUserId);
  //   }
  // }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuMenuOpen(!isMobileMenuOpen);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Define tus opciones de pago aquí
  const paymentOptions = [
    { id: 'consulta', name: 'Consulta Migratoria', price: '25.00' },
    { id: 'asesoria_extra', name: 'Proceso Original (Ejemplo)', price: '100.00' },
    // Opción de Donación con un monto fijo (puedes ajustar el precio si lo deseas)
    { id: 'donacion_fija', name: 'Donación Fija', price: '10.00' },
    { id: 'monto_abierto', name: 'Donación (Monto Abierto)', price: '' }, // Precio vacío para indicar que es personalizable
  ];

  const handlePaymentSuccess = (details: PayPalCaptureDetailsForIndex) => {
    console.log('Pago exitoso en Index.tsx:', details);
    const payerName = details.payer?.name?.given_name || 'Estimado Cliente';
    alert(`¡Gracias por tu pago, ${payerName}!`);
    setSelectedProductPrice(null);
    setCustomAmount('');
    setIsCustomAmountSelected(false);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Error de pago en Index.tsx:', error);
    alert('Hubo un problema con tu pago. Por favor, inténtalo de nuevo.');
  };

  const handleCustomAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === '') {
      setCustomAmount(value);
      if (parseFloat(value) > 0) {
        setSelectedProductPrice(value);
      } else {
        setSelectedProductPrice(null);
      }
    }
  };

  // Función para manejar la selección de una opción de pago
  const handleOptionSelect = (price: string, isCustom: boolean) => {
    if (isCustom) {
      setIsCustomAmountSelected(true);
      setSelectedProductPrice(customAmount && parseFloat(customAmount) > 0 ? customAmount : null);
    } else {
      setIsCustomAmountSelected(false);
      setCustomAmount('');
      setSelectedProductPrice(price);
    }
  };

  const finalPaymentAmount = isCustomAmountSelected ? customAmount : selectedProductPrice;
  const isPayPalButtonEnabled = finalPaymentAmount && parseFloat(finalPaymentAmount) > 0;

  // SE HA ELIMINADO LA FUNCIÓN toggleChat YA NO ES NECESARIA
  // const toggleChat = () => {
  //   setIsChatOpen(!isChatOpen);
  // };
=======
// src/pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState, useCallback, useRef } from 'react'

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

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
const isClient = () => typeof window !== 'undefined'

// -------- Alertas por búsqueda (tu lógica original, con debounce y 1 vez por sesión)
const ALERT_KEY = 'searchAlertSent'
const MIN_CHARS = 2
const DEBOUNCE_MS = 700

function useSearchAlarm(q: string) {
  const timerRef = useRef<number | null>(null)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!isClient()) return
    const term = q.trim()
    if (term.length < MIN_CHARS || firedRef.current) {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      return
    }
    timerRef.current = window.setTimeout(async () => {
      try {
        if (!sessionStorage.getItem(ALERT_KEY)) {
          sessionStorage.setItem(ALERT_KEY, '1')
          await fetch('/api/owner-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: term, url: location.href, ts: Date.now() }),
          })
        }
        const T: any = (window as any).Tawk_API
        if (T?.addEvent) T.addEvent('search_started', { query: term })
        if (T?.maximize) T.maximize()
      } catch {}
      finally { firedRef.current = true }
    }, DEBOUNCE_MS)

    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
  }, [q])
}

// -------- Proactivo a los 15s: abre Tawk o muestra toast fallback
const PROACTIVE_KEY = 'proactiveHelpShown'
function useProactiveHelp(delayMs = 15000) {
  useEffect(() => {
    if (!isClient()) return
    if (sessionStorage.getItem(PROACTIVE_KEY)) return
    const t = window.setTimeout(() => {
      try {
        const T: any = (window as any).Tawk_API
        if (T?.maximize) {
          T.maximize()
          if (T?.addEvent) T.addEvent('proactive_help', { source: 'index', delayMs })
        } else {
          // fallback: muestra el toast local
          window.dispatchEvent(new CustomEvent('rhai:showProactiveToast'))
        }
      } catch {}
      finally {
        sessionStorage.setItem(PROACTIVE_KEY, '1')
      }
    }, delayMs)
    return () => window.clearTimeout(t)
  }, [delayMs])
}

// -------- Toast fallback minimalista
function ProactiveToast() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(true)
    window.addEventListener('rhai:showProactiveToast', on as EventListener)
    return () => window.removeEventListener('rhai:showProactiveToast', on as EventListener)
  }, [])
  if (!show) return null

  const openChat = () => {
    const T: any = (window as any).Tawk_API
    if (T?.maximize) T.maximize()
    else window.location.href = '/agendar'
    setShow(false)
  }

  return (
    <div className="fixed z-50 bottom-5 right-5 max-w-sm rounded-2xl border border-gray-200 bg-white shadow-xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl">💬</div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">¿En qué puedo ayudarte?</div>
          <div className="text-sm text-gray-600 mt-1">Estoy aquí ahora mismo para guiar tu proceso.</div>
          <div className="mt-3 flex gap-2">
            <button onClick={openChat}
              className="px-3 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800">
              Chatear ahora
            </button>
            <button onClick={() => setShow(false)}
              className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50">
              Luego
            </button>
          </div>
        </div>
        <button aria-label="Cerrar" onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)

  // Proactivo a los 15s
  useProactiveHelp(15000)
  // Alarma por búsqueda
  useSearchAlarm(q)

  const NORMALIZED = useMemo(
    () => OPTIONS.map(o => ({ ...o, labelN: norm(o.label), aliasesN: SEARCH_ALIASES[o.id].map(norm) })),
    []
  )

  const suggestions = useMemo(() => {
    const s = norm(q)
    if (!s) return OPTIONS
    return NORMALIZED.filter(o => o.labelN.includes(s) || o.aliasesN.some(a => a.includes(s) || s.includes(a)))
  }, [q, NORMALIZED])

  const go = useCallback((id: OptId) => { router.push(`/destino/${id}`) }, [router])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const first = suggestions[0]
    if (first) go(first.id as OptId)
  }

  useEffect(() => { OPTIONS.forEach(o => router.prefetch(`/destino/${o.id}`)) }, [router])

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key !== 'Enter' || !focused) return
      ev.preventDefault()
      const first = suggestions[0]
      if (first) go(first.id as OptId)
    }
    if (isClient()) {
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [focused, suggestions, go])
>>>>>>> 0aecebb (Deploy inicial RHAI)

  return (
    <>
      <Head>
<<<<<<< HEAD
        <title>RHAI: Red Hispana de Apoyo a los Inmigrantes | Tu Asesoría Migratoria Confiable</title>
        <meta name="description" content="RHAI te guía en tu proceso migratorio a Estados Unidos, Europa, Canadá y el resto del mundo. Asesoría confiable y personalizada para hispanos." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white text-gray-800 font-sans">
        {/* --- Header (Barra de Navegación) --- */}
        <header className="bg-blue-800 text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <div className="text-6xl font-bold">RHAI</div>
            <ul className="hidden md:flex space-x-6">
              <li><a href="#servicios" className="hover:text-red-400 transition duration-300">Servicios</a></li>
              <li><a href="#porque-elegirnos" className="hover:text-red-400 transition duration-300">Por Qué Elegirnos</a></li>
              <li><a href="#testimonios" className="hover:text-red-400 transition duration-300">Testimonios</a></li>
              <li key="agendar-desktop">
                <Link href="/agendar" className="hover:text-red-400 transition duration-300">
                  Agenda tu Consulta
                </Link>
              </li>
              <li><a href="#contacto" className="hover:text-red-400 transition duration-300">Contacto</a></li>
            </ul>
            <button onClick={toggleMobileMenu} className="md:hidden text-white text-3xl focus:outline-none">
              &#9776;
            </button>
          </nav>
          {isMobileMenuOpen && (
            <div className="md:hidden bg-blue-700 mt-4 py-2">
              <ul className="flex flex-col items-center space-y-4">
                <li key="servicios-mobile"><a onClick={toggleMobileMenu} href="#servicios" className="block text-white hover:text-red-400 transition duration-300 py-2">Servicios</a></li>
                <li key="porque-elegirnos-mobile"><a onClick={toggleMobileMenu} href="#porque-elegirnos" className="block text-white hover:text-red-400 transition duration-300 py-2">Por Qué Elegirnos</a></li>
                <li key="testimonios-mobile"><a onClick={toggleMobileMenu} href="#testimonios" className="block text-white hover:text-red-400 transition duration-300 py-2">Testimonios</a></li>
                <li key="agendar-mobile">
                  <Link href="/agendar" className="block text-white hover:text-red-400 transition duration-300 py-2" onClick={toggleMobileMenu}>
                    Agenda tu Consulta
                  </Link>
                </li>
                <li key="contacto-mobile"><a onClick={toggleMobileMenu} href="#contacto" className="block text-white hover:text-red-400 transition duration-300 py-2">Contacto</a></li>
              </ul>
            </div>
          )}
        </header>

        {/* --- Sección Hero --- */}
        <section className="relative bg-cover bg-center h-[600px] flex items-center justify-center text-white"
          style={{ backgroundImage: "url('/images/inmigra.jpg')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="container mx-auto text-center z-10 p-4">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
              Tu Nuevo Capítulo Empieza Aquí: <br /> Asesoría Migratoria Confiable.
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              En RHAI, la Red Hispana de Apoyo a los Inmigrantes, te guiamos con experiencia y cercanía en tu camino hacia <br className="hidden md:inline" /> Estados Unidos, Europa, Canadá y el resto del mundo.
            </p>
            <Link href="/agendar" className="inline-block bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
              ¡Agenda tu Consulta Gratuita!
            </Link>
          </div>
        </section>

      
        {/* --- Sección Servicios --- */}
        <section id="servicios" className="py-20 bg-gray-50">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-blue-800 mb-2">Tu Éxito Migratorio, Nuestra Especialidad.</h2>
            <p className="text-xl text-gray-700 mb-12">Solo pagas 50 dólares por procesos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <div className="text-red-600 text-5xl mb-4">💡</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">Visados de Trabajo y Profesionales</h3>
                <p className="text-gray-600">Descubre oportunidades laborales y asegura tu futuro profesional con nuestra asesoría experta.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <div className="text-red-600 text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">Visados de Estudio</h3>
                <p className="text-gray-600">Accede a educación de calidad y experiencias internacionales con nuestra guía detallada.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <div className="text-red-600 text-5xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">Reunificación Familiar</h3>
                <p className="text-gray-600">Une a tus seres queridos y construye un hogar sin fronteras con nuestro acompañamiento legal.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <div className="text-red-600 text-5xl mb-4">🛡️</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">Asilo con Pruebas Sólidas</h3>
                <p className="text-gray-600">Te asesoramos en la preparación y presentación de casos de asilo con el soporte de pruebas contundentes, maximizando tus posibilidades de protección.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <div className="text-red-600 text-5xl mb-4">🏠</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">Residencia y Ciudadanía</h3>
                <p className="text-gray-600">Tu camino hacia la estabilidad y los derechos plenos, paso a paso, con nuestro equipo.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <div className="text-red-600 text-5xl mb-4">⚖️</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">Casos Especiales y Recursos</h3>
                <p className="text-gray-600">Soluciones a medida para situaciones complejas y orientación continua post-migratoria.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Sección Por Qué Elegirnos --- */}
        <section id="porque-elegirnos" className="py-20 bg-white">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-blue-800 mb-12">RHAI: Tu Apoyo Genuino en Cada Paso.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="flex flex-col items-center p-6">
                <div className="text-red-600 text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">Experiencia Comprobada</h3>
                <p className="text-gray-600 text-center">Más de [X] años/casos de éxito guiando a familias como la tuya.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="text-red-600 text-6xl mb-4">🤝</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">Atención Personalizada</h3>
                <p className="text-gray-600 text-center">Cada historia es única. Te ofrecemos un plan a tu medida.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="text-red-600 text-6xl mb-4">🗣️</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">Comunicación Clara y en Tu Idioma</h3>
                <p className="text-gray-600 text-center">Rompiendo barreras lingüísticas y burocráticas para tu tranquilidad.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="text-red-600 text-6xl mb-4">🌐</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">Red Global de Apoyo</h3>
                <p className="text-gray-600 text-center">Conexiones y recursos en tus destinos soñados: EE. UU., Europa, Canadá y más.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="text-red-600 text-6xl mb-4">💡</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">Transparencia Total</h3>
                <p className="text-gray-600 text-center">Procesos claros, sin sorpresas ni costos ocultos.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="text-red-600 text-6xl mb-4">⚖️</div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-2">Casos Especiales y Recursos</h3>
                <p className="text-gray-600 text-center">Soluciones a medida para situaciones complejas y orientación continua post-migratoria.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Sección Testimonios --- */}
        <section id="testimonios" className="py-20 bg-gray-100">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-blue-800 mb-12">Historias de Éxito: Familias que Ya Cumplieron su Sueño.</h2>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
              <p className="text-gray-700 italic text-lg mb-6">Gracias a Rhai, mi familia y yo estamos viviendo nuestro sueño en Canadá. Su apoyo y claridad fueron invaluables en cada etapa del proceso. ¡Altamente recomendados!</p>
              <p className="font-semibold text-blue-700">- María G., Colombia (Residente en Canadá)</p>
            </div>
          </div>
        </section>

        {/* --- Sección Preguntas Frecuentes (FAQ) --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-blue-800 text-center mb-12">¿Tienes Preguntas? Tenemos las Respuestas.</h2>
            <div className="max-w-3xl mx-auto">
              {faqItems.map((item: FAQItem, index: number) => (
                <div key={index} className="border-b border-gray-200 py-4">
                  <button
                    className="flex justify-between items-center w-full text-left text-xl font-semibold text-blue-700 focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{item.question}</span>
                    <span>{openFAQ === index ? '-' : '+'}</span>
                  </button>
                  {openFAQ === index && (
                    <div className="mt-2 text-gray-600 animate-fadeIn">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Sección CTA para Agendar Consulta --- */}
        <section id="agenda-consulta-cta" className="py-20 bg-gray-50">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-blue-800 mb-8">¡Agenda Tu Consulta Gratuita!</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              ¿Listo para dar el siguiente paso? Agenda una consulta gratuita con nuestros expertos para diseñar el plan migratorio de tus sueños.
            </p>
            <Link href="/agendar" className="inline-block bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
              Ir a la Página de Agendamiento
            </Link>
            <p className="text-md text-gray-500 mt-6">
              Serás redirigido a nuestra página de agendamiento para elegir la fecha y hora que mejor te convenga.
            </p>
          </div>
        </section>

        {/* --- Sección de Pago con PayPal - Cliente Elige --- */}
        <section className="py-20 bg-blue-100">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-blue-800 mb-8">Apoya Nuestra Misión o Patrocina un Inmigrante de bajos recursos</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Selecciona el tipo de pago que deseas realizar o ingresa un monto personalizado para tu donación:
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.price, option.id === 'monto_abierto')}
                  className={`
                    relative
                    w-36 h-36
                    rounded-lg
                    flex flex-col items-center justify-center
                    text-white
                    font-bold
                    text-center
                    shadow-lg
                    transition duration-300 ease-in-out
                    overflow-hidden
                    before:content-['']
                    before:absolute
                    before:inset-0
                    before:p-[3px]
                    before:bg-gradient-to-br
                    before:from-red-500
                    before:via-pink-500
                    before:to-red-700
                    before:z-0
                    ${(selectedProductPrice === option.price && !isCustomAmountSelected) || (option.id === 'monto_abierto' && isCustomAmountSelected)
                      ? 'transform scale-105' // Ligeramente más grande cuando está seleccionado
                      : 'hover:scale-105'
                    }
                  `}
                  style={{
                    // Fondo para el contenido del botón en sí, dentro del borde degradado
                    backgroundColor: 'rgb(220, 38, 38)', // red-600 de Tailwind
                  }}
                >
                  {/* Div interno para mantener el contenido y aplicar z-index sobre el pseudo-elemento del borde */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className="text-lg">{option.name}</span>
                    {option.price && <span className="text-sm">(${option.price})</span>}
                  </div>
                </button>
              ))}
            </div>

            {isCustomAmountSelected && (
              <div className="mt-6 mb-8 max-w-xs mx-auto">
                <label htmlFor="customAmountInput" className="block text-lg font-medium text-gray-700 mb-2">
                  Ingresa tu monto de donación en USD:
                </label>
                <input
                  type="text"
                  id="customAmountInput"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Ej: 10.00"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center text-xl font-bold"
                />
                {customAmount && parseFloat(customAmount) <= 0 && (
                  <p className="text-red-500 text-sm mt-2">El monto debe ser mayor a 0.</p>
                )}
              </div>
            )}

            {isPayPalButtonEnabled ? (
              <div className="max-w-xs mx-auto">
                <p className="text-lg text-blue-700 mb-4">Estás a punto de pagar: <span className="font-bold">${parseFloat(finalPaymentAmount || '0').toFixed(2)}</span></p>
                <DynamicPayPalButton
                  productPrice={finalPaymentAmount!}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  paypalSdkLoaded={paypalSdkLoaded}
                />
              </div>
            ) : (
              <p className="text-lg text-gray-600">Por favor, selecciona una opción de pago o ingresa un monto válido.</p>
            )}
          </div>
        </section>

        {/* --- Sección Contacto / CTA Final --- */}
        <section id="contacto" className="py-20 bg-blue-800 text-white">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-8">¿Aún Tienes Dudas? Contáctanos Directamente.</h2>
            <p className="text-xl mb-10">No dejes tu futuro al azar. Permítenos ser tu guía experta en el camino hacia tu nuevo hogar.</p>

            <div className="mt-12 text-lg">
              <p>Puedes contactarnos vía email o teléfono:</p>
              <p className="mt-2">📧 <a href="mailto:inmigrationsrhai@gmail.com" className="text-white hover:underline">inmigrationsrhai@gmail.com</a></p>
              <p className="mt-2">📞 <a href="tel:+19292417449" className="text-white hover:underline">+1 (929) 241-7449</a></p>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="bg-blue-900 text-white py-8">
          <div className="container mx-auto text-center px-4">
            <div className="text-2xl font-bold mb-4">RHAI</div>
            <p className="mb-4">Red Hispana de Apoyo a los Inmigrantes</p>

            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-white hover:text-red-400 transition duration-300 text-2xl"><FaFacebookF /></a>
              <a href="#" className="text-white hover:text-red-400 transition duration-300 text-2xl"><FaInstagram /></a>
              <a href="#" className="text-white hover:text-red-400 transition duration-300 text-2xl"><FaLinkedinIn /></a>
            </div>

            <div className="flex justify-center space-x-6 text-sm mb-4">
              <a href="/politica-privacidad" className="text-white hover:underline">Política de Privacidad</a>
              <a href="/terminos-condiciones" className="text-white hover:underline">Términos y Condiciones</a>
            </div>

            <p className="text-sm">&copy; {new Date().getFullYear()} RHAI. Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>

      {/* --- SE HAN ELIMINADO TODOS LOS COMPONENTES DE CHAT EN VIVO NATIVO --- */}
      {/* El botón de chat siempre visible */}
      {/* <ChatButton onClick={toggleChat} /> */}
      {/* La ventana de chat solo se muestra si isChatOpen es true Y tenemos un conversationId y userId */}
      {/* {isChatOpen && conversationId && userId && (
        <ChatWindow onClose={toggleChat} userId={userId} conversationId={conversationId} />
      )} */}
    </>
  );
}
=======
        <title>RHAI | Elige tu destino</title>
        <meta name="description" content="Elige tu destino migratorio y entra directo a la página específica: Estados Unidos, Canadá, Europa u otros países." />
        <link rel="canonical" href="https://tu-dominio.com/" />
        <meta name="robots" content="index,follow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
        {/* barra búsqueda */}
        <section className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
          <div className="container mx-auto px-4 py-6">
            <form onSubmit={onSubmit} role="search" aria-label="Buscar destino" className="relative max-w-5xl mx-auto">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Busca tu destino: Estados Unidos, Canadá, Europa, Otros países…"
                className="w-full text-lg md:text-xl rounded-2xl border border-gray-200 px-5 py-4 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                aria-autocomplete="list"
                autoComplete="off"
                inputMode="search"
              />
              {q && (
                <button type="button" onClick={() => setQ('')} aria-label="Borrar búsqueda"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
              )}
            </form>
          </div>
        </section>

        {/* tarjetas */}
        <section className="container mx-auto px-4 py-14">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-blue-900 mb-3">Elige tu destino</h1>
          <p className="text-center text-gray-600 mb-10">Clic en una opción y entras directo. Sin formularios.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {suggestions.map((o) => (
              <Link key={o.id} href={`/destino/${o.id}`}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-200">
                <div className="text-6xl mb-4 select-none">{o.emoji}</div>
                <div className="text-2xl font-bold text-blue-800">{o.label}</div>
                <div className="text-sm text-gray-500 mt-1">Abrir página de {o.label.toLowerCase()}</div>
                <div className="mt-6 inline-flex items-center gap-2 text-blue-700 font-semibold group-hover:gap-3 transition">
                  Ver más <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* toast fallback proactivo */}
        <ProactiveToast />
      </main>
    </>
  )
}
>>>>>>> 0aecebb (Deploy inicial RHAI)
