import { useState, useEffect } from 'react'

function RestTimer({ duration, onComplete, onSkip }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const percentage = ((duration - timeLeft) / duration) * 100

  return (
    <div id="rest-timer" className="bg-white rounded-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-yellow-600">Rest Time</h2>

        <div className="relative inline-flex items-center justify-center">
          <svg className="transform -rotate-90" width="240" height="240">
            <circle
              cx="120"
              cy="120"
              r="110"
              stroke="#374151"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="120"
              cy="120"
              r="110"
              stroke="#facc15"
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - percentage / 100)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-gray-900">
              {minutes > 0 && `${minutes}:`}
              {seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onSkip}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-full transition-colors text-lg min-h-[56px]"
      >
        Skip Rest
      </button>
    </div>
  )
}

export default RestTimer
