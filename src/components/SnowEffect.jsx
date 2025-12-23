import { useEffect } from 'react'

function SnowEffect() {
  useEffect(() => {
    const canvas = document.getElementById('snow-canvas')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const snowflakes = []
    const maxFlakes = 100

    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speed = Math.random() * 2 + 0.5
        this.opacity = Math.random() * 0.5 + 0.3
        this.wind = Math.random() * 0.5 - 0.25
      }

      update() {
        this.y += this.speed
        this.x += this.wind + Math.sin(this.y * 0.01) * 0.5

        if (this.y > canvas.height) {
          this.y = 0
          this.x = Math.random() * canvas.width
        }

        if (this.x > canvas.width) {
          this.x = 0
        } else if (this.x < 0) {
          this.x = canvas.width
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.fill()
        ctx.shadowBlur = 10
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
      }
    }

    // Create snowflakes
    for (let i = 0; i < maxFlakes; i++) {
      snowflakes.push(new Snowflake())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      snowflakes.forEach(flake => {
        flake.update()
        flake.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      id="snow-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  )
}

export default SnowEffect

