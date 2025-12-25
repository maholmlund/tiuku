import { ReactNode } from "react";
import styles from "./normalButton.module.css"

export default function NormalButton({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.buttonDiv}>
      {children}
    </div>
  )
}
