import { ReactNode } from "react";
import styles from "./page.module.css"
import AccentButton from "@/components/accentButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.centered}>
      <h1>Tiuku</h1>
      <p className={styles.explanationParagraph}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi totam, quaerat debitis recusandae vitae rem! Minima voluptates, necessitatibus optio aspernatur maxime suscipit magnam vitae itaque ullam quisquam laboriosam nam repellendus quae, quod quam in iusto rerum quis explicabo. Cum, veritatis!</p>
      <p className={styles.explanationParagraph}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi totam, quaerat debitis recusandae vitae rem! Minima voluptates, necessitatibus optio aspernatur maxime suscipit magnam vitae itaque ullam quisquam laboriosam nam repellendus quae, quod quam in iusto rerum quis explicabo. Cum, veritatis!</p>
      <div className={styles.cardContainer}>
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
