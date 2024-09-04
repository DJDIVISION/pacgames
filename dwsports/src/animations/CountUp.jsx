import React, { useState, useEffect } from 'react'

const CountUp = ({ endValue, duration }) => {
  const [currentValue, setCurrentValue] = useState(0)
  const [bgColor, setBgColor] = useState('red')

  useEffect(() => {
    let startValue = 0
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const value = parseFloat((progress * endValue).toFixed(2))

      setCurrentValue(value)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [endValue, duration])

  return <div>{currentValue}</div>
}

export default CountUp