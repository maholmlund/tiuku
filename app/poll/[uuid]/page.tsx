"use client"
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import CenteredContent from "@/components/centeredContent";
import styles from "./page.module.css"

type Poll = {
  title: string,
  start: string,
  end: string,
  responses: [],
};

export default function PollPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [error, setError] = useState("");
  const [poll, setPoll] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/poll/${uuid}`);
      if (result.status === 404) {
        setNotFound(true);
        return;
      } else if (!result.ok) {
        setError("something went wrong");
        return;
      }
      const data = await result.json();
      setPoll(data);
    }
    fetchData();
  },
    []);

  if (error) {
    return (
      <p>{error}</p>
    )
  } else if (notFound) {
    return (
      <InvalidLink />
    )
  } else if (poll) {
    return (
      <Poll poll={poll} />
    )
  } else {
    return (
      <Loading />
    )
  }
}

function Loading() {
  return (
    <CenteredContent>
      <p>loading...</p>
    </CenteredContent>
  )
}

function InvalidLink() {
  return (
    <CenteredContent>
      <h1>This poll can't be read 😞</h1>
      <p>Please check your link.</p>
    </CenteredContent>
  )
}

function Poll({ poll }: { poll: Poll }) {
  const [newUserName, setNewUserName] = useState("");
  const { uuid } = useParams<{ uuid: string }>();

  const submitNewUser = async () => {
    const result = await fetch(
      `/api/poll/${uuid}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: newUserName,
          responses: "0".repeat(30)
        })
      }
    );
    setNewUserName("");
    window.location.reload();
  }

  return (
    <CenteredContent>
      <h1>{poll.title}</h1>
      <p>start: {poll.start}</p>
      <p>end: {poll.end}</p>
      <div className={styles.buttonContainer}>
        {poll.responses.map((r: any) => {
          return <UserButton
            onClick={_ => { }}
            key={`button-${r.name}`}
          >{r.name}</UserButton>;
        })}
        {poll.responses.length < 10 &&
          <div className={styles.newButton}>
            <input
              placeholder="New user"
              className={styles.newInput}
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
            />
            <button
              className={styles.plusIcon}
              onClick={submitNewUser}
            >
              <IconPlus />
            </button>
          </div>}
      </div>
    </CenteredContent>
  )
}

function UserButton({ onClick, children }: { onClick: (e: any) => void, children?: ReactNode }) {
  return (
    <button onClick={onClick} className={styles.userButton}>
      {children}
      <IconPencil />
    </button>
  )
}
