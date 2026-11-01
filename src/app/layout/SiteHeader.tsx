import type { Ref } from 'react'
import logo from '../../assets/logo/Willy-wonka-and-the-chocolate-factory-movie-logo.webp'
import { Link } from 'react-aria-components'
import { NavigationRoute } from '../../router/routes'
import { ChocolateDrips } from '../components/ChocolateDrips/ChocolateDrips'
import { appName } from '../appName'
import './SiteHeader.css'

interface SiteHeaderProps {
  actionsRef?: Ref<HTMLDivElement>
}

export const SiteHeader = ({ actionsRef }: SiteHeaderProps) => (
  <header className="site-header">
    <div className="site-header-bar">
      <div className="content-column site-header-inner">
        <div className="site-header-brand">
          <Link
            href={NavigationRoute.Index}
            aria-label={`${appName} home`}
            className="site-header-logo-link"
          >
            <img
              className="site-header-logo"
              src={logo}
              alt=""
              width={592}
              height={304}
            />
          </Link>
          <h1 className="site-header-title">{appName}</h1>
        </div>
        <div ref={actionsRef} className="site-header-actions" />
      </div>
      <ChocolateDrips />
    </div>
  </header>
)
