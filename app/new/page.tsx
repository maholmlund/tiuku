"use client"
import styles from "./page.module.css"
import AccentButton from "@/components/accentButton"
import CopyBox from "@/components/copyBox"
import CenteredContent from "@/components/centeredContent"
import { useState } from "react"

export default function New() {
  const [link, setLink] = useState("");
  if (!link) {
    return (
      <NewForm setLink={(l: string) => setLink(l)} />
    )
  }
  return (
    <CreationSuccessful link={link} />
  )
}

function NewForm({ setLink }: { setLink: (link: string) => void }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const addDate = (first: string, days: number) => {
    let date = new Date(first);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  const submit = async () => {
    const result = await fetch("/api/poll", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        start: start,
        end: end
      })
    })
    console.log(result);
    if (result.ok) {
      setLink((await result.json()).link);
    }
  }

  return (
    <CenteredContent>
      <h1>Create New Poll</h1>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th className={styles.tableHeading}>Title</th>
            <td className={styles.tableItem}>
              <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </td>
          </tr>
          <tr>
            <th className={styles.tableHeading}>Start Date</th>
            <td className={styles.tableItem}>
              <input
                type="date"
                className={styles.input}
                value={start} onChange={(e) => setStart(e.target.value)}
                min={end ? addDate(end, -30) : ""}
                max={end}
              />
            </td>
          </tr>
          <tr>
            <th className={styles.tableHeading}>End Date</th>
            <td className={styles.tableItem}>
              <input
                type="date"
                className={styles.input}
                value={end} onChange={(e) => setEnd(e.target.value)}
                min={start}
                max={start ? addDate(start, +30) : ""}
              />
            </td>
          </tr>
          <tr>
            <th></th>
            <td className={styles.tableItem}>
              <button onClick={submit}>
                <AccentButton>
                  Create
                </AccentButton>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p className={styles.bottomText}>The poll and all associated data will be automatically deleted after 30 days.</p>
    </CenteredContent>
  )
}

function CreationSuccessful({ link }: { link: string }) {
  return (
    <CenteredContent>
      <h1 className={styles.successHeader}>Poll Created</h1>
      <CopyBox data={link} />
      <p className={styles.bottomText}>Your poll was successfully created. Please save this link now since you will not be able to access it after leaving this page.</p>
    </CenteredContent>
  )
}
