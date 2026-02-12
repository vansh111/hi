import { useState, useEffect, useRef, useCallback } from 'react'
import SongCard from './components/SongCard'

/* ---------- SONGS DATA ---------- */
const songs = [
  {
    name: 'ਤੇਰੇ ਬਿਨ',
    artist: 'Rabbi Shergill',
    search: 'Tere Bin Rabbi Shergill',
    emoji: '🎶',
  },
  {
    name: 'ਵਾਲੀਆਂ',
    artist: 'Harnoor',
    search: 'Walliyan Harnoor',
    emoji: '🎵',
  },
  {
    name: 'ਅੱਖੀਆਂ',
    artist: 'Jatt & Juliet',
    search: 'Akhiyan Jatt and Juliet',
    emoji: '🎶',
  },
]

const GRADIENT_CLASSES = [
  'song-gradient-1', 'song-gradient-2', 'song-gradient-3',
]

const reasons = [
  { icon: '✨', title: 'ਤੇਰੀ ਮੁਸਕਾਨ', text: 'ਤੇਰੀ ਹੱਸੀ ਮੇਰਾ ਸਭ ਤੋਂ ਪਸੰਦੀਦਾ ਸੰਗੀਤ ਹੈ। ਇਹ ਮੇਰੇ ਹਨੇਰੇ ਦਿਨਾਂ ਨੂੰ ਰੌਸ਼ਨ ਕਰ ਦਿੰਦੀ ਹੈ ✨' },
  { icon: '🦋', title: 'ਤੇਰਾ ਦਿਲ', text: 'ਤੇਰੇ ਕੋਲ ਦੁਨੀਆ ਦਾ ਸਭ ਤੋਂ ਪਿਆਰਾ ਦਿਲ ਹੈ। ਤੇਰੇ ਕਰਕੇ ਮੈਂ ਇੱਕ ਬਿਹਤਰ ਇਨਸਾਨ ਬਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ 💛' },
  { icon: '🌸', title: 'ਸਾਡੀਆਂ ਹੱਸੀਆਂ', text: 'ਅਸੀਂ ਇਕੱਠੇ ਕਿੰਨੀ ਹੱਸਦੇ ਹਾਂ, ਹੋਰ ਕੋਈ ਨਹੀਂ ਕਰ ਸਕਦਾ। ਤੂੰ ਮੇਰੀ ਖੁਸ਼ੀ ਦੀ ਜਗ੍ਹਾ ਹੈ 🌸' },
]

const scaredMessages = [
  'ਉਹ ਨਹੀਂ! 😭', 'ਦੁਬਾਰਾ ਸੋਚ! 🥺', 'ਪਲੀਜ਼?? 💔',
  'ਸੱਚਮੁੱਚ?! 😢', 'ਮੇਰਾ ਦਿਲ... 💫', 'ਨਹੀਂ ਪਲੀਜ਼! 🥹',
]

export default function App() {
  const [preloaderVisible, setPreloaderVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const [loveMeterAnimate, setLoveMeterAnimate] = useState(false)
  const [celebration, setCelebration] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [questionTypingDone, setQuestionTypingDone] = useState(false)
  const [noClickCount, setNoClickCount] = useState(0)

  const loveMeterRef = useRef(null)
  const questionRef = useRef(null)
  const noButtonRef = useRef(null)

  /* ---- OPEN ENVELOPE ---- */
  const openEnvelope = () => {
    setPreloaderVisible(false)
    setTimeout(() => setShowContent(true), 500)
  }

  /* ---- LOVE METER OBSERVER ---- */
  useEffect(() => {
    if (!showContent) return
    const el = loveMeterRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoveMeterAnimate(true)
          obs.unobserve(entry.target)
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [showContent])

  /* ---- QUESTION TYPING EFFECT ---- */
  useEffect(() => {
    if (!showContent) return
    const el = questionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const text = 'ਕੀ ਤੂੰ ਮੇਰੀ Valentine ਬਣੇਂਗੀ?'
          let i = 0
          const interval = setInterval(() => {
            i++
            setQuestionText(text.slice(0, i))
            if (i >= text.length) {
              clearInterval(interval)
              setQuestionTypingDone(true)
            }
          }, 80)
          obs.unobserve(entry.target)
          return () => clearInterval(interval)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [showContent])

  /* ---- SPARKLE TRAIL ---- */
  useEffect(() => {
    if (!showContent) return
    const handler = (e) => {
      const s = document.createElement('div')
      s.className = 'sparkle'
      s.innerHTML = '<div class="sparkle-dot"></div>'
      s.style.left = `${e.clientX - 3}px`
      s.style.top = `${e.clientY - 3}px`
      document.body.appendChild(s)
      setTimeout(() => s.remove(), 1000)
    }
    document.addEventListener('mousemove', handler)
    return () => document.removeEventListener('mousemove', handler)
  }, [showContent])

  /* ---- NO BUTTON ---- */
  const handleNo = useCallback(() => {
    if (!noButtonRef.current) return
    const btn = noButtonRef.current
    setNoClickCount((c) => c + 1)

    // Scared text
    const msg = scaredMessages[noClickCount % scaredMessages.length]
    const scared = document.createElement('div')
    scared.className = 'scared-text'
    scared.textContent = msg
    scared.style.left = `${btn.getBoundingClientRect().left}px`
    scared.style.top = `${btn.getBoundingClientRect().top - 20}px`
    document.body.appendChild(scared)
    setTimeout(() => scared.remove(), 1500)

    // Move button
    const vw = window.innerWidth
    const vh = window.innerHeight
    btn.style.position = 'fixed'
    btn.style.left = `${Math.random() * (vw - 120)}px`
    btn.style.top = `${Math.random() * (vh - 60)}px`
    btn.style.zIndex = '100'
    btn.style.transition = 'all 0.3s ease'

    // Shrink after many clicks
    if (noClickCount > 3) {
      btn.style.transform = `scale(${Math.max(0.4, 1 - noClickCount * 0.08)})`
    }
  }, [noClickCount])

  /* ---- YES ---- */
  const handleYes = () => {
    setCelebration(true)
    // Confetti
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const c = document.createElement('div')
        c.className = 'confetti-piece'
        c.style.left = `${Math.random() * 100}vw`
        c.style.width = `${Math.random() * 8 + 4}px`
        c.style.height = `${Math.random() * 14 + 6}px`
        c.style.background = ['#d4796a','#e8918a','#f7b89c','#fad0c4','#c97b6b','#ffecd2'][Math.floor(Math.random()*6)]
        c.style.borderRadius = `${Math.random() * 4}px`
        c.style.animationDuration = `${Math.random() * 2 + 2}s`
        c.style.animationDelay = `${Math.random() * 0.5}s`
        document.body.appendChild(c)
        setTimeout(() => c.remove(), 5000)
      }, i * 40)
    }
  }

  /* ---------- PETAL DATA ---------- */
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${Math.random() * 8 + 8}s`,
    spinDuration: `${Math.random() * 4 + 3}s`,
    color: ['#f7b89c','#e8918a','#fad0c4','#d4796a','#c97b6b'][Math.floor(Math.random()*5)],
    opacity: Math.random() * 0.3 + 0.15,
  }))

  /* ---------- HERO NAME LETTERS ---------- */
  const nameLetters = 'Tanya Gupta'.split('').map((ch, i) => (
    <span key={i} style={{ animationDelay: `${0.8 + i * 0.06}s` }}>
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  ))

  /* ---------- RENDER ---------- */
  return (
    <>
      {/* ======= PRELOADER ======= */}
      <div id="preloader" className={preloaderVisible ? '' : 'hidden'}>
        <div className="envelope-wrapper" onClick={openEnvelope}>
          <svg className="envelope-svg" viewBox="0 0 220 160">
            <defs>
              <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffecd2" />
                <stop offset="100%" stopColor="#fcb69f" />
              </linearGradient>
            </defs>
            <rect x="10" y="30" width="200" height="120" rx="12" fill="url(#envGrad)" stroke="#e8c4b0" strokeWidth="1.5" />
            <polygon points="10,30 110,95 210,30" fill="none" stroke="#e8c4b0" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 10 30 Q 110 110 210 30" fill="rgba(252,182,159,0.3)" />
            <rect x="70" y="8" width="80" height="35" rx="4" fill="#fff5ee" stroke="#e8c4b0" strokeWidth="1" />
            <text x="110" y="28" textAnchor="middle" fontFamily="Great Vibes, cursive" fontSize="14" fill="#c97b6b">with love</text>
            <circle cx="110" cy="60" r="8" fill="none" stroke="#d4796a" strokeWidth="1.2" opacity="0.4" />
            <path d="M106,58 a4,4 0 0,1 8,0 a4,4 0 0,1 -8,0" fill="#d4796a" opacity="0.4" transform="translate(0,2)" />
          </svg>
        </div>
        <div className="envelope-text">ਤੁਹਾਡੇ ਲਈ ਇੱਕ ਖ਼ਾਸ ਚਿੱਠੀ ਹੈ...</div>
        <div className="envelope-subtext">ਖੋਲ੍ਹਣ ਲਈ ਕਲਿੱਕ ਕਰੋ</div>
      </div>

      {showContent && (
        <>
          {/* ======= PETALS ======= */}
          <div className="petals-bg">
            {petals.map((p) => (
              <div
                key={p.id}
                className="petal"
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              >
                <div
                  className="petal-inner"
                  style={{
                    background: p.color,
                    opacity: p.opacity,
                    animationDuration: p.spinDuration,
                  }}
                />
              </div>
            ))}
          </div>

          {/* ======= BLOBS ======= */}
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          {/* ======= HERO ======= */}
          <section className="hero">
            <div className="hero-dear">ਮੇਰੀ ਪਿਆਰੀ,</div>
            <h1 className="hero-name">{nameLetters}</h1>
            <p className="hero-subtitle">
              ਇਹ ਛੋਟੀ ਜਿਹੀ ਚਿੱਠੀ ਤੈਨੂੰ ਦੱਸਣ ਲਈ ਹੈ ਕਿ ਤੂੰ ਕਿੰਨੀ ਖ਼ਾਸ ਹੈ ✨
            </p>
            <div className="scroll-indicator">
              <span>ਹੇਠਾਂ ਸਕ੍ਰੋਲ ਕਰੋ</span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </section>

          {/* ======= DIVIDER ======= */}
          <div className="divider">
            <div className="divider-line" />
            <span style={{ fontSize: '1.2rem' }}>💌</span>
            <div className="divider-line" />
          </div>

          {/* ======= REASONS ======= */}
          <section>
            <h2 className="section-title">ਮੈਂ ਤੈਨੂੰ ਕਿਉਂ ਪਿਆਰ ਕਰਦਾ ਹਾਂ</h2>
            <p className="section-subtitle">ਕੁਝ ਕਾਰਨ ਜੋ ਤੈਨੂੰ ਬੇਮਿਸਾਲ ਬਣਾਉਂਦੇ ਨੇ</p>
            <div className="reasons-grid">
              {reasons.map((r, i) => (
                <ReasonCard key={i} reason={r} delay={i * 120} />
              ))}
            </div>
          </section>

          {/* ======= DIVIDER ======= */}
          <div className="divider">
            <div className="divider-line" />
            <span style={{ fontSize: '1.2rem' }}>💕</span>
            <div className="divider-line" />
          </div>

          {/* ======= LOVE METER ======= */}
          <section className="love-meter-section">
            <div className="love-meter-container" ref={loveMeterRef}>
              <h2 className="section-title">ਪਿਆਰ ਮੀਟਰ</h2>
              <p className="section-subtitle">ਮੈਂ ਤੈਨੂੰ ਕਿੰਨਾ ਪਿਆਰ ਕਰਦਾ ਹਾਂ</p>
              <div className="love-meter">
                <div className={`love-meter-fill ${loveMeterAnimate ? 'animate' : ''}`} />
              </div>
              <div className="love-meter-label">ਬੇਅੰਤ ♾️ ਪਿਆਰ</div>
              {loveMeterAnimate && <div className="love-percentage">∞%</div>}
            </div>
          </section>

          {/* ======= DIVIDER ======= */}
          <div className="divider">
            <div className="divider-line" />
            <span style={{ fontSize: '1.2rem' }}>🎵</span>
            <div className="divider-line" />
          </div>

          {/* ======= SONGS ======= */}
          <section className="songs-section" id="songs">
            <h2 className="section-title">🎵 ਤੈਨੂੰ ਸਮਰਪਿਤ ਗੀਤ</h2>
            <p className="section-subtitle">ਹਰ ਗੀਤ ਵਿੱਚ ਤੇਰੇ ਲਈ ਮੇਰਾ ਦਿਲ ਧੜਕਦਾ ਹੈ</p>
            <div className="songs-grid">
              {songs.map((song, i) => (
                <SongCard
                  key={i}
                  song={song}
                  gradientClass={GRADIENT_CLASSES[i]}
                  delay={i * 120}
                />
              ))}
            </div>
          </section>

          {/* ======= DIVIDER ======= */}
          <div className="divider">
            <div className="divider-line" />
            <span style={{ fontSize: '1.2rem' }}>💝</span>
            <div className="divider-line" />
          </div>

          {/* ======= THE BIG QUESTION ======= */}
          <section className="question-section" ref={questionRef}>
            <div className="question-text">
              ਸੋ...
            </div>
            <div className="question-sub">
              {questionText}
              {!questionTypingDone && <span className="typing-cursor" />}
            </div>
            <div className="buttons-container">
              <button className="btn-yes" onClick={handleYes}>
                ❤️ ਹਾਂ!
              </button>
              <button className="btn-no" ref={noButtonRef} onClick={handleNo}>
                ਸ਼ਾਇਦ ਨਹੀਂ...
              </button>
            </div>
          </section>

          {/* ======= CELEBRATION ======= */}
          {celebration && (
            <div id="celebration" className="active">
              <div className="celebration-hearts">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="floating-heart"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${Math.random() * 5 + 5}s`,
                      fontSize: `${Math.random() * 20 + 12}px`,
                    }}
                  >
                    {['💖','💕','💗','💓','🩷','🤍'][Math.floor(Math.random()*6)]}
                  </div>
                ))}
              </div>
              <div className="celebration-sub">
                ਤੂੰ ਅੱਜ ਮੈਨੂੰ ਦੁਨੀਆ ਦਾ ਸਭ ਤੋਂ ਖੁਸ਼ ਬੰਦਾ ਬਣਾ ਦਿੱਤਾ ਹੈ। ਮੈਂ ਹਰ ਪਲ ਤੇਰੇ ਨਾਲ ਬਿਤਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਤੂੰ ਮੇਰੀ ਦੁਨੀਆ ਹੈ 🌍💕
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

/* ---------- REASON CARD SUB-COMPONENT ---------- */
function ReasonCard({ reason, delay }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          obs.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`reason-card ${visible ? 'visible' : ''}`}>
      <div className="reason-icon">{reason.icon}</div>
      <h3>{reason.title}</h3>
      <p>{reason.text}</p>
    </div>
  )
}

