"use client"
import styles from "./page.module.css"
import AccentButton from "@/components/accentButton"
import CopyBox from "@/components/copyBox"
import CenteredContent from "@/components/centeredContent"
import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { fi } from "react-day-picker/locale"
import { DateRange } from "react-day-picker"
import "react-day-picker/style.css"
import "@/app/rdp.css"

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
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);
  const [error, setError] = useState("");

  const submit = async () => {
    const result = await fetch("/api/poll", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        start: selected?.from?.toISOString().split('T')[0],
        end: selected?.to?.toISOString().split('T')[0],
      })
    })
    console.log(result);
    if (result.ok) {
      setLink((await result.json()).link);
    } else {
      setError("Please specify a valid name and a valid time range")
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
        </tbody>
      </table>
      <DayPicker
        animate={true}
        required={false}
        timeZone="UTC"
        mode="range"
        max={29}
        min={1}
        locale={fi}
        selected={selected}
        onSelect={setSelected}
      />
      <table className={styles.table}>
        <tbody>
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
      {error &&
        <p>{error}</p>}
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
