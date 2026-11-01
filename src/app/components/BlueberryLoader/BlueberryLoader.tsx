import type { AnimationEvent, CSSProperties } from 'react'
import { Label, ProgressBar } from 'react-aria-components'
import { Blueberry } from '../Blueberry/Blueberry'
import { loaderAppearDelayMs } from './loaderTiming'
import './BlueberryLoader.css'

interface BlueberryLoaderProps {
  label?: string
  isLeaving?: boolean
  onLeft?: () => void
}

export const BlueberryLoader = ({
  label = 'Loading',
  isLeaving,
  onLeft,
}: BlueberryLoaderProps) => {
  const finishLeaving = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && isLeaving) onLeft?.()
  }

  return (
    <div
      className="blueberry-loader"
      data-leaving={isLeaving || undefined}
      style={
        { '--loader-appear-delay': `${loaderAppearDelayMs}ms` } as CSSProperties
      }
      onAnimationEnd={finishLeaving}
    >
      <div className="blueberry-stage" aria-hidden="true">
        <Blueberry className="blueberry-inflating" />
      </div>
      <ProgressBar className="loader-progress" isIndeterminate>
        <div className="loader-track">
          <div className="loader-fill" />
        </div>
        <Label className="loader-label">
          {label}
          <span className="loader-dots" aria-hidden="true">
            ...
          </span>
        </Label>
      </ProgressBar>
    </div>
  )
}
