import logo from '../../assets/logo/Willy-wonka-and-the-chocolate-factory-movie-logo.webp'
import { ChocolateDrips } from '../components/ChocolateDrips/ChocolateDrips'
import { appName } from '../appName'
import './SiteHeader.css'

export const SiteHeader = () => (
  <header className="site-header">
    <div className="site-header-bar">
      <div className="content-column site-header-inner">
        <img
          className="site-header-logo"
          src={logo}
          alt=""
          width={592}
          height={304}
        />
        <h1 className="site-header-title">{appName}</h1>
      </div>
      <ChocolateDrips />
    </div>
  </header>
)
