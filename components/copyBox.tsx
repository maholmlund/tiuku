"use client"

import styles from "./copyBox.module.css"
import { IconCopy, IconCheck } from "@tabler/icons-react"
import { useState } from "react"

export default function CopyBox({ data }: { data: string }) {
  const [success, setSuccess] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(data);
    setSuccess(true);
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        readOnly
        value={data}
        className={styles.input}
      />
      <button
        className={styles.copyButton}
        onClick={copy}
      >
        {success ? (
          <IconCheck size={24} className={styles.success} />
        ) : (
          <IconCopy size={24} color="var(--text2)" />
        )}
      </button>
    </div>
  )
}
