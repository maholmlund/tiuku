"use client"
import { useParams } from "next/navigation";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import { IconPencil, IconPlus, IconCircleCheck } from "@tabler/icons-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css"
import "@/app/rdp.css"
import { fi } from "react-day-picker/locale"
import CenteredContent from "@/components/centeredContent";
import AccentButton from "@/components/accentButton";
import NormalButton from "@/components/normalButton";
import { decode, getPatchMessage, PollData, rebase, MAX_POLL_RESPONSES } from "@/lib/client-poll";
import styles from "./page.module.css"
import dayjs from "dayjs";

const MAX_RETRIES = 4;

async function sendUpdate(data: PollData) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const patchMessage = await getPatchMessage(data);
    const response = await fetch(
      `/api/poll/${data.uuid}`,
      {
        method: "PATCH",
        body: patchMessage
      }
    );
    if (response.ok) return;
    const result = await fetch(`/api/poll/${data.uuid}`);
    await rebase(data, JSON.parse(await result.text())!.encryptedData);
  }
  console.error("Failed to update poll after multiple retries");
}

export default function PollPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [error, setError] = useState("");
  const [poll, setPoll] = useState<PollData | null>(null);
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
      const decodedPoll = await decode(data.encryptedData, data.createdAt, window.location.hash.slice(1) ?? "", uuid);
      setPoll(decodedPoll);
    }
    fetchData();
  },
    [uuid]);

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
      <h1>{`This poll can't be read 😞`}</h1>
      <p>Please check your link.</p>
    </CenteredContent>
  )
}

function Poll({ poll }: { poll: PollData }) {
  const [newUserName, setNewUserName] = useState("");
  const { uuid } = useParams<{ uuid: string }>();
  const [editingUser, setEditingUser] = useState<string>();

  const submitNewUser = async () => {
    let data = structuredClone(poll);
    data.responses.set(newUserName, Array.from({ length: 30 }, () => false));
    await sendUpdate(data);
    setNewUserName("");
    window.location.reload();
  }

  if (editingUser) {
    return <ResponseEditor
      pollData={poll}
      onClose={() => setEditingUser(undefined)}
      user={editingUser}
    />
  }

  return (
    <CenteredContent>
      <h1>{poll.title}</h1>
      <div className={styles.buttonContainer}>
        {Array.from(poll.responses.entries()).map(([name]) => {
          return <UserButton
            onClick={() => { setEditingUser(name) }}
            key={`button-${name}`}
          >{name}</UserButton>;
        })}
        {poll.responses.size < MAX_POLL_RESPONSES &&
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
      <ResponseTable start={poll.startDate} end={poll.endDate} responses={poll.responses} />
      <p className={styles.deletionDateText}>Poll will be deleted on {dayjs(poll.createdAt).add(31, "day").format("DD.MM.YYYY")}.</p>
    </CenteredContent>
  )
}

function UserButton({ onClick, children }: { onClick: MouseEventHandler<HTMLButtonElement>, children?: ReactNode }) {
  return (
    <button onClick={onClick} className={styles.userButton}>
      {children}
      <IconPencil />
    </button>
  )
}

function ResponseTable({ start, end, responses }:
  {
    start: string,
    end: string,
    responses: Map<string, boolean[]>
  }) {
  const dates = [];
  for (let i = 0; dayjs(start).add(i, "day").isBefore(dayjs(end).add(1)); i++) {
    dates.push(dayjs(start).add(i, "day").format("D.M.YYYY"));
  }
  if (responses.size === 0) return;
  return (
    <div className={styles.responseContainer}>
      <table>
        <tbody>
          <tr>
            <th></th>
            {Array.from(responses.entries()).map(([name, responses]) => {
              return (
                <th key={`heading-${name}`} >
                  <div className={styles.nameHeading}>
                    {name}
                  </div>
                </th>
              )
            })}
          </tr>
          {dates.map((d, i) => {
            return (
              <tr key={`date-${d}`}>
                <th className={styles.dateHeading}>
                  {d}
                </th>
                {Array.from(responses.entries()).map(([name, responses]) => {
                  return (
                    <td key={`${d}-${name}`} className={styles.checkMarkContainer}>
                      {responses[i] === true ?
                        <IconCircleCheck /> : ""}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ResponseEditor({
  pollData, onClose, user
}: {
  pollData: PollData,
  onClose: () => void,
  user: string,
}) {
  const [selected, setSelected] = useState<Date[] | undefined>([]);
  useEffect(() => {
    const dates = [];
    for (let i = 0; dayjs(pollData.startDate).add(i, "day").isBefore(dayjs(pollData.endDate).add(1, "days")); i++) {
      if (pollData.responses.get(user)![i] === true)
        dates.push(new Date(dayjs(pollData.startDate).add(i, "days").format("YYYY-MM-DD")));
    }
    // according to my knowledge in this situation this is ok
    setSelected(dates); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pollData, user]);

  const submit = async () => {
    let responses = [];
    for (let current = dayjs(pollData.startDate); current.isBefore(dayjs(pollData.endDate).add(1, "day")); current = current.add(1, "day")) {
      if (!!selected?.find(v => v.getTime() === new Date(current.format("YYYY-MM-DD")).getTime())) {
        responses.push(true);
      } else {
        responses.push(false);
      }
    }
    while (responses.length < 30) responses.push(false);
    pollData.responses.set(user, responses);
    await sendUpdate(pollData);
    window.location.reload();
  }

  return (
    <CenteredContent>
      <h1>Editing {user}</h1>
      <DayPicker
        animate={true}
        required={false}
        timeZone="UTC"
        mode="multiple"
        locale={fi}
        disabled={{ before: new Date(pollData.startDate), after: new Date(dayjs(pollData.endDate).format("YYYY-MM-DD")) }}
        selected={selected}
        onSelect={setSelected}
      />

      <div className={styles.editorButtonRow}>
        <button onClick={onClose}>
          <NormalButton>
            Cancel
          </NormalButton>
        </button>
        <button onClick={submit}>
          <AccentButton>
            Save
          </AccentButton>
        </button>
      </div>
    </CenteredContent>
  )
}
