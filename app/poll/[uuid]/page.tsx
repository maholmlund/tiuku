"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CenteredContent from "@/components/centeredContent";

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
  return (
    <CenteredContent>
      <h1>{poll.title}</h1>
      <p>start: {poll.start}</p>
      <p>end: {poll.end}</p>
    </CenteredContent>
  )
}
