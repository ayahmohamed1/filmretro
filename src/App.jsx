import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const photos = Array.from({ length: 38 }, (_, index) => `/images/photo${index + 2}.jpg`)

const messageParagraphs = [
  'This isn’t goodbye, it’s the end of one of the most beautiful chapters of our lives. Thank you to our school and to the place that brought us together and made us one big family.',
  'We may have had our fights and disagreements, but one day we’ll look back, smile, and miss even the little things we once took for granted. Every laugh, every moment, and every memory will always have a special place in our hearts.',
  'I wish we could live these days all over again. Until we meet again, you’ll always be part of our favorite memories. ❤️',
]

function VideoPlayer({ onPlay, onPause }) {
  return (
    <video
      className="retro-video"
      controls
      playsInline
      preload="auto"
      aria-label="Our video"
      onPlay={onPlay}
      onPause={onPause}
    >
      <source src="/images/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

export default function App() {
  const musicRef = useRef(null)
  const [hasOpened, setHasOpened] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const [photoDirection, setPhotoDirection] = useState(1)
  const [showMessage, setShowMessage] = useState(false)
  const [musicError, setMusicError] = useState(false)

  const playBackgroundMusic = () => {
    if (!hasOpened || !musicRef.current) return

    musicRef.current.play().then(() => {
      setMusicError(false)
    }).catch((error) => {
      console.error('Background music could not be played.', error)
      setMusicError(true)
    })
  }

  const pauseBackgroundMusic = () => {
    musicRef.current?.pause()
  }

  const changePhoto = (direction) => {
    setPhotoDirection(direction)
    setActivePhoto((current) => (current + direction + photos.length) % photos.length)
  }

  const selectPhoto = (index) => {
    if (index !== activePhoto) {
      setPhotoDirection(index > activePhoto ? 1 : -1)
      setActivePhoto(index)
    }
  }

  const openWebsite = () => {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    window.scrollTo(0, 0)
    setHasOpened(true)
    musicRef.current?.play().then(() => {
      setMusicError(false)
    }).catch((error) => {
      console.error('Background music could not be played.', error)
      setMusicError(true)
    })
  }

  useEffect(() => {
    if (showMessage) {
      document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [showMessage])

  return (
    <div className="relative">
    <audio
      ref={musicRef}
      src="/music/song.mp3"
      loop
      preload="auto"
      onError={() => setMusicError(true)}
    />
    <main
      aria-hidden={!hasOpened}
      className={`retro-site min-h-screen w-full text-[#202020] ${hasOpened ? '' : 'hidden'}`}
    >
      <section
        id="home"
        className="retro-screen flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center"
      >
        <p className="font-serif text-xs uppercase tracking-[0.3em] text-[#555] sm:text-sm">
          a little collection of memories
        </p>
        <h1 className="memory-title my-3">
           Memory <span>of us</span>
        </h1>
        <div className="retro-single-photo mt-5 w-full max-w-sm sm:max-w-md">
          <img
            src="/images/photo1.jpg"
            alt="A favorite memory"
            className="block h-auto w-full object-contain"
          />
        </div>
        <a
          href="#video"
          className="mt-8 font-serif text-xs uppercase tracking-[0.25em] text-[#333] underline decoration-[#888] underline-offset-8"
        >
          scroll to remember ↓
        </a>
      </section>

      <section id="video" className="retro-screen flex flex-col items-center px-5 py-20 text-center">
        <p className="font-serif text-xs uppercase tracking-[0.3em] text-[#555]">take me back</p>
        <h2 className="mb-8 mt-2 font-serif text-3xl uppercase tracking-widest text-[#202020] sm:text-4xl">
          Our little movie
        </h2>
        <VideoPlayer onPlay={pauseBackgroundMusic} onPause={playBackgroundMusic} />
      </section>

      <section id="memories" className="retro-screen flex flex-col items-center px-5 py-20 text-center">
        <div className="memory-album-wrap">
          <div className="memory-album w-full max-w-md">
            <h2 className="memory-title">
              These Memories <span>Make Me Smile</span>
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/80">
              Photo {activePhoto + 2} of 39
            </p>

            <div className="memory-photo-wrap mt-6">
              <AnimatePresence mode="wait" custom={photoDirection}>
                <motion.img
                  key={photos[activePhoto]}
                  custom={photoDirection}
                  src={photos[activePhoto]}
                  alt={`Memory ${activePhoto + 1}`}
                  className="memory-photo"
                  initial={{ opacity: 0, x: (photoDirection * 70), rotateY: photoDirection * 12, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, x: (photoDirection * -70), rotateY: photoDirection * -12, scale: 0.96 }}
                  transition={{ duration: 0.42, ease: [0.22, 0.7, 0.25, 1] }}
                />
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => changePhoto(-1)}
                className="album-arrow"
                aria-label="Previous photo"
              >
                ←
              </button>
              <span className="text-xl" aria-hidden="true">♥</span>
              <button
                type="button"
                onClick={() => changePhoto(1)}
                className="album-arrow"
                aria-label="Next photo"
              >
                →
              </button>
            </div>

            <div className="memory-thumbnails mt-5 flex gap-3">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={photo}
                  onClick={() => selectPhoto(index)}
                  className={`album-thumbnail ${activePhoto === index ? 'album-thumbnail-active' : ''}`}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={activePhoto === index ? 'true' : undefined}
                >
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowMessage((visible) => !visible)}
          aria-expanded={showMessage}
          aria-controls="message"
          className="message-button mt-9"
        >
          {showMessage ? 'Close message' : 'Message for you'}
        </button>
      </section>

      <AnimatePresence>
        {showMessage && (
          <motion.section
            id="message"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.3 }}
            className="retro-screen flex min-h-screen flex-col items-center justify-center px-5 py-20"
          >
            <article className="newspaper w-full max-w-3xl text-left">
              <div className="newspaper-masthead">
                <span>OUR TIME TOGETHER</span>
                <span>A SPECIAL EDITION</span>
                <span>FOREVER IN OUR MEMORIES</span>
              </div>
              <h2 className="newspaper-title">THE MEMORY TIMES</h2>
              <div className="newspaper-rule" />
              <h3 className="newspaper-headline">THE END OF A BEAUTIFUL CHAPTER</h3>
              <p className="newspaper-deck">A little note for the people who made it unforgettable</p>
              <div className="newspaper-columns">
                {messageParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <footer className="newspaper-footer">YOU WILL ALWAYS BE PART OF OUR STORY</footer>
            </article>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
    {hasOpened && (
      <>
      {musicError && (
        <button type="button" className="music-retry" onClick={playBackgroundMusic}>
          Tap to play music
        </button>
      )}
      <nav className="emoji-bar" aria-label="Page navigation">
        <a href="#home" aria-label="First page: photo" title="Photo">📸</a>
        <a href="#video" aria-label="Video page" title="Video">🎥</a>
        <a href="#memories" aria-label="Photo album page" title="Photo album">📷</a>
        <a
          href="#message"
          onClick={() => setShowMessage(true)}
          aria-label="Message page"
          title="Message"
        >
          💌
        </a>
      </nav>
      </>
    )}
    <AnimatePresence>
      {!hasOpened && (
        <motion.button
          type="button"
          aria-label="Open the website"
          onClick={openWebsite}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5 }}
          className="retro-screen fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6"
        >
          <motion.img
            src="/images/newenv.png"
            alt="Open the envelope to enter the website"
            className="retro-photo max-h-[72vh] w-auto max-w-[min(85vw,24rem)] object-contain drop-shadow-2xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          />
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-[#333]">
            Tap to open
          </span>
        </motion.button>
      )}
    </AnimatePresence>
    </div>
  )
}
