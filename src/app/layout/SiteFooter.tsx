import './SiteFooter.css'

const wave =
  'M0 192 C220 100 440 100 660 192 C880 284 1100 284 1320 192 L1320 500 L0 500 Z'

const layers = ['caramel', 'milk', 'dark'] as const

const tileCount = 8

export const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer-waves" aria-hidden="true">
      {Array.from({ length: tileCount }, (_, tile) => (
        <svg
          key={tile}
          className="site-footer-tile"
          viewBox="0 80 1320 300"
          preserveAspectRatio="none"
        >
          {layers.map((layer) => (
            <path
              key={layer}
              d={wave}
              className={`site-footer-layer site-footer-layer-${layer}`}
            />
          ))}
        </svg>
      ))}
    </div>
    <p className="site-footer-text">
      Frontend Case Solution for Attensi{' '}
      <span className="site-footer-separator" /> Created by Kamile Nanartonyte
    </p>
  </footer>
)
