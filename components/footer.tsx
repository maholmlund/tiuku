import Link from "next/link"
import styles from "./footer.module.css"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerRow}>
        <Link className={styles.footerItem} href="/">Privacy</Link>
        <Link className={styles.footerItem} href="https://github.com/maholmlund/tiuku">
          <Image src="/github-mark-white.svg" width={64} height={64} alt="github logo" />
        </Link>
        <Link className={styles.footerItem} href="/">License</Link>
      </div>
      <div className={styles.footerRow}>
        <p className={styles.footerItem}>With ❤️ from Finland</p>
      </div>
    </footer>
  )
}
