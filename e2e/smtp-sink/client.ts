import { ReceivedEmail } from "./sink";

const CONTROL_URL = "http://127.0.0.1:2526";

export async function getReceivedEmails(): Promise<ReceivedEmail[]> {
  const res = await fetch(`${CONTROL_URL}/emails`);
  if (!res.ok) {
    throw new Error(`Failed to get emails from sink: ${res.status}`);
  }
  return res.json();
}

export async function clearReceivedEmails(): Promise<void> {
  const res = await fetch(`${CONTROL_URL}/clear`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Failed to clear emails in sink: ${res.status}`);
  }
}

export async function stopSmtpServer(): Promise<void> {
  const res = await fetch(`${CONTROL_URL}/stop`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Failed to stop SMTP server: ${res.status}`);
  }
}

export async function startSmtpServer(): Promise<void> {
  const res = await fetch(`${CONTROL_URL}/start`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Failed to start SMTP server: ${res.status}`);
  }
}

/**
 * Polls the sink until the expected count of emails is received, or times out.
 */
export async function waitForEmails(
  expectedCount: number,
  timeoutMs = 5000,
  pollIntervalMs = 100
): Promise<ReceivedEmail[]> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const emails = await getReceivedEmails();
    if (emails.length >= expectedCount) {
      return emails;
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
  return getReceivedEmails();
}

