import { weddingConfig } from '../../data/wedding.config'

export function Footer() {
  const { contact, footer } = weddingConfig

  return (
    <footer className="border-t border-blush/40 bg-gradient-to-b from-transparent to-lavender/30 px-4 py-12 text-center">
      <p className="font-display text-2xl text-text italic">{footer.thankYou}</p>
      <p className="mt-4 text-text-muted">
        {contact.hotlineLabel}:{' '}
        <a
          href={`tel:${contact.hotline.replace(/\s/g, '')}`}
          className="font-semibold text-pink-soft hover:underline"
        >
          {contact.hotline}
        </a>
      </p>
      <p className="mt-8 text-xs text-text-muted/70">{footer.credit}</p>
    </footer>
  )
}
