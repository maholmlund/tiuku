import { ReactNode } from "react";
import styles from "./centeredContent.module.css"

export default function CenteredContent({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.centeredContent}>
      {children}
    </div>
  )
}
