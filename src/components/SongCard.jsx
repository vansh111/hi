import { useState, useRef, useEffect } from 'react'

export default function SongCard({ song, gradientClass, delay }) {
  const cardRef = useRef(null)
  const [visible, setVisible] = useState(false)

  /* — scroll animation — */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [delay])

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.search)}`

  return (
    <div ref={cardRef} className={`song-card ${visible ? 'visible' : ''}`}>
      {/* ---- gradient header ---- */}
      <div className="song-card-top">
        <div className={`song-gradient ${gradientClass}`}>
          <span className="song-music-icon">{song.emoji}</span>
        </div>
      </div>

      {/* ---- card body ---- */}
      <div className="song-card-body">
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="song-play-btn"
        >
          <svg viewBox="0 0 24 24">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        </a>
        <div className="song-info">
          <div className="song-name">{song.name}</div>
          <div className="song-artist">{song.artist}</div>
        </div>
      </div>

      {/* ---- YouTube link ---- */}
      <div className="song-yt-link">
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
          YouTube Link
        </a>
      </div>
    </div>
  )
}
