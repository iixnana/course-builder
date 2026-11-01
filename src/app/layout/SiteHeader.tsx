import type { Ref } from 'react'
import logo from '../../assets/logo/Willy-wonka-and-the-chocolate-factory-movie-logo.webp'
import { Button } from 'react-aria-components'
import { ChocolateDrips } from '../components/ChocolateDrips/ChocolateDrips'
import {
  IconButtonTooltip,
  IconTooltipTrigger,
} from '../components/IconButton/IconButton'
import { appName } from '../appName'
import { requestDemoReset } from './demoReset'
import './SiteHeader.css'

interface SiteHeaderProps {
  actionsRef?: Ref<HTMLDivElement>
}

export const SiteHeader = ({ actionsRef }: SiteHeaderProps) => (
  <header className="site-header">
    <div className="site-header-bar">
      <div className="content-column site-header-inner">
        <div className="site-header-brand">
          <IconTooltipTrigger>
            <Button
              aria-label="Reset to Demo Course"
              className="site-header-logo-button"
              onPress={requestDemoReset}
            >
              <img
                className="site-header-logo"
                src={logo}
                alt=""
                width={592}
                height={304}
              />
            </Button>
            <IconButtonTooltip label="Reset to Demo Course" />
          </IconTooltipTrigger>
          <h1 className="site-header-title">{appName}</h1>
        </div>
        <div ref={actionsRef} className="site-header-actions" />
      </div>
      <ChocolateDrips />
    </div>
  </header>
)
