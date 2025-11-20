import PageContent from "@/components/pageContent"
import styles from "./not-found.module.css"
import Link from "next/link"

export default function NotFound() {
  return (
    <PageContent>
      <div className={styles.centered}>
        <h1>404 Oops!</h1>
        <p>Not found</p>
        <Link href="/" className={styles.link}>
          Back to front page
        </Link>
      </div>
    </PageContent>
  )
}
