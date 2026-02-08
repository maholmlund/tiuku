import Link from "next/link"
import styles from "./footer.module.css"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerRow}>
        <Link className={styles.footerItem} href="/privacy">Privacy</Link>
        <Link className={styles.footerItem} href="https://github.com/maholmlund/tiuku">
          <picture>
            <source srcSet="/github-logo-white.svg" media="(prefers-color-scheme: dark)" />
            <Image src="/github-logo-dark.svg" alt="github logo" width={64} height={64} />
          </picture>
        </Link>
        <Link className={styles.footerItem} href="https://github.com/maholmlund/tiuku/blob/main/LICENSE">License</Link>
      </div>
      <div className={styles.footerRow}>
        <p className={styles.footerItem}>With ❤️ from Finland</p>
      </div>
    </footer>
  )
}
