import PageContent from "@/components/pageContent"
import Link from "next/link"

export default function NotFound() {
  return (
    <PageContent>
      <div className="notFoundCentered">
        <h1>404 Oops!</h1>
        <p>Not found</p>
        <Link href="/" className="notFoundLink">
          Back to front page
        </Link>
      </div>
    </PageContent>
  )
}
