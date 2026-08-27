import Link from "next/link"
import styles from "./navbar.module.css"
import { ReactNode } from "react"

export default function NavBar({ children }: { children?: ReactNode }) {
  // Using an a-tag in the navbar instead of a Link tag fixes a console error when
  // navigating from the front page to the poll page and then back to the front page.
  return (
    <nav className={styles.navbar}>
      <a href="/">
        <h1>Tiuku</h1>
      </a>
      <div className={styles.linkGroup}>
        <div className={styles.navBarItem}>
          {children}
        </div>
      </div>
    </nav>
  )
}
