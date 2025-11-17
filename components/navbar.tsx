import Link from "next/link"
import styles from "./navbar.module.css"
import { ReactNode } from "react"

export default function NavBar({ children }: { children?: ReactNode }) {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <h1>Tiuku</h1>
      </Link>
      <div className={styles.linkGroup}>
        <div className={styles.navBarItem}>
          {children}
        </div>
      </div>
    </nav>
  )
}
