import { ReactNode } from "react";
import styles from "./accentButton.module.css"

export default function AccentButton({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.buttonDiv}>
      {children}
    </div>
  )
}
