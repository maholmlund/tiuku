import { ReactNode } from "react";
import styles from "./page.module.css"
import AccentButton from "@/components/accentButton";
import Link from "next/link";
import { IconChevronDown } from "@tabler/icons-react";

export default function Home() {
  return (
    <>
      <div className={styles.centered}>
        <div className={styles.landingSection}>
          <h1>Tiuku</h1>
          <p className={styles.explanationParagraph}>This is a demo deployment. Please use only test data.</p>
        </div>
      </div>
      <p className={styles.explanationParagraph}>Tiuku is an application that allows you to create date-based polls. You can select a time interval between 1 and 30 days and have up to 10 answers. Polls are automatically deleted 30 days after creation.</p>
      <p className={styles.explanationParagraph}>Tiuku is an end-to-end encrypted poll service. When creating a new poll, the browser creates an AES-128 encryption key, creates an empty poll, encrypts it, and sends it to the server. The server only stores the encrypted data, the UUID of the poll, and the date of its creation. The link of the poll first contains the UUID of the poll, followed by the encryption key in the anchor tag. The encryption key is not transferred to the server.</p>
      <p className={styles.explanationParagraph}>When opening a poll, the browser requests the encrypted data from the server. It then decrypts the data with the encryption key from the anchor tag. When the poll is modified, the data is re-encrypted and sent to the server, which stores it only in an encrypted format.</p>
      <div className={styles.cardContainer} >
        <Card>
          <h1>No Accounts</h1>
          <p>There are no accounts. Just create a poll and share it with your friends.</p>
        </Card>
        <Card>
          <h1>Free?</h1>
          <p>This demo deployment is free until my MongoDB Atlas free tier limit of 512MB runs out :)</p>
        </Card>
      </div>
      <div className={styles.centered}>
        <Link href="/new">
          <AccentButton>
            New Poll
          </AccentButton>
        </Link>
      </div>
    </>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
}
