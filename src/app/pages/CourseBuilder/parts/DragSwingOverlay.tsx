import { useDndMonitor } from '@dnd-kit/core'
import { useEffect, useRef, type ReactNode } from 'react'
import { createSpring } from '../../../utils/spring'

export interface DropRect {
  top: number
  left: number
  width: number
  height: number
}

interface DragSwingOverlayProps {
  hasMotion: boolean
  onRelease: (rect: DropRect, rotation: number) => void
  children: ReactNode
}

const sensitivity = 0.5
const maxAngle = 20
const smoothing = 0.12
const deadZone = 0.3
const swingSpring = { stiffness: 220, damping: 22 }

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const DragSwingOverlay = ({
  hasMotion,
  onRelease,
  children,
}: DragSwingOverlayProps) => {
  const liftRef = useRef<HTMLDivElement>(null)
  const swingRef = useRef<HTMLDivElement>(null)
  const spring = useRef(createSpring(swingSpring))
  const pointerX = useRef(0)
  const lastX = useRef(0)
  const velocity = useRef(0)

  useEffect(() => {
    if (!hasMotion) return
    let frame = 0
    let lastTime = performance.now()

    const step = (now: number) => {
      const seconds = Math.min((now - lastTime) / 1000, 0.064)
      lastTime = now
      velocity.current +=
        (pointerX.current - lastX.current - velocity.current) * smoothing
      lastX.current = pointerX.current
      const effective =
        Math.abs(velocity.current) < deadZone ? 0 : velocity.current
      spring.current.setTarget(
        clamp(-effective * sensitivity, -maxAngle, maxAngle),
      )
      spring.current.tick(seconds)
      swingRef.current?.style.setProperty(
        '--swing-rotate',
        `${spring.current.getValue()}deg`,
      )
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [hasMotion])

  const release = () => {
    const lift = liftRef.current
    const swing = swingRef.current
    if (!lift || !swing) return
    const bounds = lift.getBoundingClientRect()
    const width = swing.offsetWidth
    const height = swing.offsetHeight
    onRelease(
      {
        left: bounds.left + bounds.width / 2 - width / 2,
        top: bounds.top + bounds.height / 2 - height / 2,
        width,
        height,
      },
      spring.current.getValue(),
    )
  }

  useDndMonitor({
    onDragMove: ({ delta }) => {
      pointerX.current = delta.x
    },
    onDragEnd: release,
    onDragCancel: release,
  })

  return (
    <div ref={liftRef} className="drag-lift">
      <div ref={swingRef} className="drag-swing">
        {children}
      </div>
    </div>
  )
}
