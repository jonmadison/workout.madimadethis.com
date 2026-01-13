import { useState, useEffect, useRef } from 'react'
import { MdChevronRight } from 'react-icons/md'

function RestTimer({ duration, onComplete, onSkip, nextExercise, isOpen }) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // Keep ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Reset and start timer when opening
  useEffect(() => {
    if (isOpen && duration > 0) {
      setTimeLeft(duration)
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [isOpen, duration])

  // Countdown timer
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setTimeout(() => {
      const newTime = timeLeft - 1
      if (newTime <= 0) {
        setIsActive(false)
        onCompleteRef.current()
      } else {
        setTimeLeft(newTime)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isActive, timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // Calculate percentage - start at 0% when timeLeft equals duration
  const percentage = duration > 0 && timeLeft > 0
    ? ((duration - timeLeft) / duration) * 100
    : 0
  const circumference = 2 * Math.PI * 70

  if (!isOpen || timeLeft <= 0) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onSkip}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300"
        style={{ maxHeight: '80vh' }}
      >
        <div className="p-6">
          {/* Handle bar */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

          <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Rest Time</h2>

          {/* Circular Timer */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg className="transform -rotate-90" width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - percentage / 100)}
                  style={{ transition: 'stroke-dashoffset 0.15s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {minutes > 0 && `${minutes}:`}
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={onSkip}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px] uppercase tracking-wide"
          >
            Skip Rest
          </button>
        </div>
      </div>
    </>
  )
}

export default RestTimer
