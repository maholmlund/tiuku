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
import styles from "./page.module.css"
import dayjs from "dayjs";

type Response = {
  name: string,
  responses: string
};

type Poll = {
  title: string,
  start: string,
  end: string,
  responses: Response[],
  createdAt: string,
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

function Poll({ poll }: { poll: Poll }) {
  const [newUserName, setNewUserName] = useState("");
  const { uuid } = useParams<{ uuid: string }>();
  const [editingResponse, setEditingResponse] = useState<Response>();

  const submitNewUser = async () => {
    await fetch(
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

  if (editingResponse) {
    return <ResponseEditor
      response={editingResponse}
      onClose={() => setEditingResponse(undefined)}
      start={poll.start}
      end={poll.end}
      uuid={uuid}
    />
  }

  return (
    <CenteredContent>
      <h1>{poll.title}</h1>
      <div className={styles.buttonContainer}>
        {poll.responses.map((r: Response) => {
          return <UserButton
            onClick={() => { setEditingResponse(r) }}
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
      <ResponseTable start={poll.start} end={poll.end} responses={poll.responses} />
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
    responses: Response[]
  }) {
  const dates = [];
  for (let i = 0; dayjs(start).add(i, "day").isBefore(dayjs(end).add(1)); i++) {
    dates.push(dayjs(start).add(i, "day").format("D.M.YYYY"));
  }
  if (responses.length === 0) return;
  return (
    <div className={styles.responseContainer}>
      <table>
        <tbody>
          <tr>
            <th></th>
            {responses.map(r => {
              return (
                <th key={`heading-${r.name}`} >
                  <div className={styles.nameHeading}>
                    {r.name}
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
                {responses.map(r => {
                  return (
                    <td key={`${d}-${r.name}`} className={styles.checkMarkContainer}>
                      {r.responses[i] === "1" ?
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
  response, onClose, start, end, uuid
}: {
  response: Response,
  onClose: () => void,
  start: string,
  end: string,
  uuid: string,
}) {
  const [selected, setSelected] = useState<Date[] | undefined>([]);
  useEffect(() => {
    const dates = [];
    for (let i = 0; dayjs(start).add(i, "day").isBefore(dayjs(end).add(1, "days")); i++) {
      if (response.responses[i] === "1")
        dates.push(new Date(dayjs(start).add(i, "days").format("YYYY-MM-DD")));
    }
    // according to my knowledge in this situation this is ok
    setSelected(dates); // eslint-disable-line react-hooks/set-state-in-effect
  }, [end, start, response.responses]);

  const submit = async () => {
    let responses = "";
    for (let current = dayjs(start); current.isBefore(dayjs(end).add(1, "day")); current = current.add(1, "day")) {
      if (!!selected?.find(v => v.getTime() === new Date(current.format("YYYY-MM-DD")).getTime())) {
        responses = responses + "1"
      } else {
        responses = responses + "0"
      }
    }
    while (responses.length < 30) responses = responses + "0";
    await fetch(`/api/poll/${uuid}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name: response.name, responses: responses })
      }
    );
    window.location.reload();
  }

  return (
    <CenteredContent>
      <h1>Editing {response.name}</h1>
      <DayPicker
        animate={true}
        required={false}
        timeZone="UTC"
        mode="multiple"
        locale={fi}
        disabled={{ before: new Date(start), after: new Date(dayjs(end).format("YYYY-MM-DD")) }}
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
