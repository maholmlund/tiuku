import { ReactNode } from "react";
import styles from "./pageContent.module.css"

export default function PageContent({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.pageContent}>
      {children}
    </div>
  )
}
