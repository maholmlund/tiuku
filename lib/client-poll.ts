export const MAX_POLL_RESPONSES = 10;

export type PollData = {
  title: string;
  startDate: string;
  endDate: string;
  responses: Map<string, boolean[]>;
  createdAt: string;
  key: CryptoKey;
  uuid: string;
  _oldResponses: Map<string, boolean[]>;
  _oldSha256: string;
}

type SecretData = {
  title: string;
  startDate: string;
  endDate: string;
  responses: Map<string, boolean[]>;
}

export async function initialize(title: string, startDate: string, endDate: string): Promise<PollData> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 128 },
    true,
    ["encrypt", "decrypt"]
  );

  return {
    title,
    startDate,
    endDate,
    responses: new Map<string, boolean[]>(),
    key: key,
    createdAt: "",
    _oldResponses: new Map<string, boolean[]>(),
    _oldSha256: "",
    uuid: ""
  };
}

export async function decode(encryptedData: string, createdAt: string, key: string, uuid: string): Promise<PollData> {
  const decodedKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(key, "hex"),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
  const { title, startDate, endDate, responses } = await _decrypt(encryptedData, decodedKey);
  const pollData: PollData = {
    title,
    startDate,
    endDate,
    responses,
    key: decodedKey,
    createdAt,
    _oldResponses: new Map(responses),
    uuid: uuid,
    _oldSha256: Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(encryptedData, "base64"))).toString('hex'),
  };
  return pollData;
}

export function getEncryptedData(pollData: PollData): Promise<string> {
  return _encrypt({
    title: pollData.title,
    startDate: pollData.startDate,
    endDate: pollData.endDate,
    responses: pollData.responses
  }, pollData.key);
}

export async function getPatchMessage(data: PollData): Promise<string> {
  return JSON.stringify({
    sha256: data._oldSha256,
    newData: await getEncryptedData(data),
  });
}

export async function rebase(data: PollData, encryptedData: string): Promise<void> {
  data._oldSha256 = Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(encryptedData, "base64"))).toString('hex');
  const decodedData = await _decrypt(encryptedData, data.key);

  let changedResponses = new Map<string, boolean[]>();
  const union = new Map([...data._oldResponses.entries(), ...data.responses.entries()]);
  console.log("union", union);
  console.log("old", data._oldResponses);
  union.forEach((value, key) => {
    if (!(data._oldResponses.has(key)
      && data.responses.has(key)
      && data._oldResponses.get(key) === data.responses.get(key))) {
      changedResponses.set(key, value);
    }
  });
  console.log("changed", changedResponses);
  let newResponses = decodedData.responses;
  changedResponses.forEach((value, key) => {
    // The entry was modified
    if (data.responses.has(key) && data._oldResponses.has(key)) {
      if (newResponses.size < MAX_POLL_RESPONSES) {
        newResponses.set(key, value);
      }
    }
    // The entry was added
    else if (data.responses.has(key)) {
      if (newResponses.size < MAX_POLL_RESPONSES) {
        newResponses.set(key, value);
      }
    }
    // The entry was removed
    else {
      newResponses.delete(key);
    }
  });
  data._oldResponses = decodedData.responses;
  data.responses = newResponses;
  console.log(data.responses);
}

function _encrypt(data: SecretData, key: CryptoKey): Promise<string> {
  // We generate a new IV randomly each time. If the poll is saved multiple
  // times there is a small chance that the new IV will collide with one of
  // the previous IVs. This would be a security issue but since the chance
  // is very low (2^96 different IVs) we ignore it.
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(data, _jsonReplacer))
  ).then((ciphertext) => {
    return Buffer.from(iv).toString('base64') + Buffer.from(ciphertext).toString('base64');
  });
}

function _decrypt(encryptedData: string, key: CryptoKey): Promise<SecretData> {
  const iv = Buffer.from(encryptedData.slice(0, 16), "base64");
  const ciphertext = Buffer.from(encryptedData.slice(16), "base64");

  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  ).then((decryptedData) => {
    const decodedData = new TextDecoder().decode(decryptedData);
    return JSON.parse(decodedData, _jsonReviver) as SecretData;
  });
}

function _jsonReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return {
      __type: "Map",
      value: Array.from(value.entries()),
    };
  }

  return value;
}

function _jsonReviver(_key: string, value: unknown): unknown {
  if (value && typeof value === "object" && "__type" in value && (value as { __type?: unknown }).__type === "Map") {
    return new Map(((value as unknown) as { value: [string, boolean[]][] }).value);
  }

  return value;
}
