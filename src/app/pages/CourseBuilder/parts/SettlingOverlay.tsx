import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { springKeyframes } from '../../../utils/spring'
import type { DropRect } from './DragSwingOverlay'

interface SettlingOverlayProps {
  id: string
  rect: DropRect
  rotation: number
  onDone: () => void
  children: ReactNode
}

const settleSpring = { stiffness: 250, damping: 25 }
const settleSeconds = 0.6
const frames = 60
const liftScale = 1.04

export const SettlingOverlay = ({
  id,
  rect,
  rotation,
  onDone,
  children,
}: SettlingOverlayProps) => {
  const positionRef = useRef<HTMLDivElement>(null)
  const poseRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const target = document.querySelector(`[data-settling-target="${id}"]`)
    if (!target || !positionRef.current || !poseRef.current) {
      onDone()
      return
    }
    const to = target.getBoundingClientRect()
    const spring = (from: number, end: number) =>
      springKeyframes(from, end, frames, settleSpring, settleSeconds)

    const xs = spring(rect.left, to.left)
    const ys = spring(rect.top, to.top)
    const position = positionRef.current.animate(
      xs.map((x, index) => ({
        transform: `translate(${x}px, ${ys[index]}px)`,
      })),
      { duration: settleSeconds * 1000, fill: 'forwards' },
    )

    const scales = spring(liftScale, 1)
    const rotations = spring(rotation, 0)
    const pose = poseRef.current.animate(
      scales.map((scale, index) => ({
        transform: `rotate(${rotations[index]}deg) scale(${scale})`,
      })),
      { duration: settleSeconds * 1000, fill: 'forwards' },
    )

    position.onfinish = onDone
    return () => {
      position.cancel()
      pose.cancel()
    }
  }, [id, rect, rotation, onDone])

  return (
    <div
      ref={positionRef}
      className="settling-overlay"
      style={{
        width: rect.width,
        height: rect.height,
        transform: `translate(${rect.left}px, ${rect.top}px)`,
      }}
    >
      <div ref={poseRef} className="settling-pose">
        {children}
      </div>
    </div>
  )
}
