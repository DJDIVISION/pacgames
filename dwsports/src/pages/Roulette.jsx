import React, { useState } from 'react'

const Roulette = () => {
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)

  // Array of roulette segments
  const segments = [
    { label: '1', color: 'red' },
    { label: '2', color: 'black' },
    { label: '3', color: 'green' },
    { label: '4', color: 'blue' },
    { label: '5', color: 'yellow' },
    { label: '6', color: 'purple' },
    { label: '7', color: 'orange' },
    { label: '8', color: 'pink' },
    { label: '9', color: 'cyan' },
    { label: '10', color: 'lime' },
    { label: '11', color: 'magenta' },
    { label: '12', color: 'brown' },
  ]

  const spinRoulette = () => {
    // Number of rotations
    const spins = Math.floor(Math.random() * 5) + 10 // random spins between 10 and 14

    // Total degrees (360 degrees per spin + random angle within the last spin)
    const randomAngle = Math.random() * 360
    const totalRotation = spins * 360 + randomAngle

    setRotation(totalRotation)

    // Determine the result segment
    const segmentAngle = 360 / segments.length
    const finalAngle = totalRotation % 360 // Get the final angle within a single circle
    const selectedIndex = Math.floor(finalAngle / segmentAngle)
    const selectedSegment = segments[selectedIndex].label

    // Update the result after the animation completes
    setTimeout(() => {
      setResult(selectedSegment)
    }, 5000) // Match the timeout with your CSS animation duration
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: '5px solid #000',
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 5s ease-out',
        }}
      >
        {segments.map((segment, index) => {
          const angle = (360 / segments.length) * index
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                backgroundColor: segment.color,
                transformOrigin: '100% 100%',
                transform: `rotate(${angle}deg) translate(100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {segment.label}
            </div>
          )
        })}
      </div>
      <button onClick={spinRoulette} style={{ marginTop: '20px' }}>
        Spin
      </button>
      {result && (
        <div style={{ marginTop: '20px' }}>
          <strong>Result: {result}</strong>
        </div>
      )}
    </div>
  )
}

export default Roulette
