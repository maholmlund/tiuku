import { ReactNode } from "react";
import styles from "./page.module.css"
import AccentButton from "@/components/accentButton";
import Link from "next/link";
import { IconChevronDown } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className={styles.centered}>
      <div className={styles.landingSection}>
        <h1>Tiuku</h1>
        <p className={styles.explanationParagraph}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi totam, quaerat debitis recusandae vitae rem! Minima voluptates, necessitatibus optio aspernatur maxime suscipit magnam vitae itaque ullam quisquam laboriosam nam repellendus quae, quod quam in iusto rerum quis explicabo. Cum, veritatis!</p>
        <p className={styles.explanationParagraph}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi totam, quaerat debitis recusandae vitae rem! Minima voluptates, necessitatibus optio aspernatur maxime suscipit magnam vitae itaque ullam quisquam laboriosam nam repellendus quae, quod quam in iusto rerum quis explicabo. Cum, veritatis!</p>
        <Link href={"#bottom"}>
          <IconChevronDown size={48} color="var(--text3)" className={styles.scrollDown} />
        </Link>
      </div>
      <div className={styles.cardContainer} id="bottom">
        <Card>
          <h1>Lorem</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id eos libero temporibus. Voluptatem atque ex iure, sint corrupti quia enim?</p>
        </Card>
        <Card>
          <h1>Lorem</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id eos libero temporibus. Voluptatem atque ex iure, sint corrupti quia enim?</p>
        </Card>
      </div>
      <Link href="/new">
        <AccentButton>
          New Poll
        </AccentButton>
      </Link>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
}
