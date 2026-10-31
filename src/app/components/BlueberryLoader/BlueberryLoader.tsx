import { Label, ProgressBar } from 'react-aria-components'
import { Blueberry } from '../Blueberry/Blueberry'
import './BlueberryLoader.css'

interface BlueberryLoaderProps {
  label?: string
}

export const BlueberryLoader = ({
  label = 'Loading',
}: BlueberryLoaderProps) => (
  <div className="blueberry-loader">
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
