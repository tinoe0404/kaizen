import http from "node:http";
import { SMTPServer } from "smtp-server";
import { simpleParser, ParsedMail, AddressObject } from "mailparser";

export interface ReceivedEmail {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  date?: string;
}

const SMTP_PORT = 2525;
const HTTP_PORT = 2526;

let receivedEmails: ReceivedEmail[] = [];
let smtpServer: SMTPServer | null = null;
let httpServer: http.Server | null = null;
let isSmtpRunning = false;

function addressToString(addr: AddressObject | AddressObject[] | undefined): string {
  if (!addr) return "";
  if (Array.isArray(addr)) {
    return addr.map((a) => a.text).join(", ");
  }
  return addr.text || "";
}

function addressToFirstEmail(addr: AddressObject | AddressObject[] | undefined): string {
  if (!addr) return "";
  if (Array.isArray(addr)) {
    return addr[0]?.value[0]?.address || addr[0]?.text || "";
  }
  return addr.value[0]?.address || addr.text || "";
}

export function createSmtpServer(): SMTPServer {
  return new SMTPServer({
    disabledCommands: ["STARTTLS"],
    authOptional: true,
    onAuth(_auth, _session, callback) {
      // Accept all credentials
      callback(null, { user: "test-user" });
    },
    onData(stream, _session, callback) {
      simpleParser(stream)
        .then((parsed: ParsedMail) => {
          const email: ReceivedEmail = {
            to: addressToString(parsed.to),
            from: addressToString(parsed.from),
            replyTo: parsed.replyTo ? addressToFirstEmail(parsed.replyTo) : undefined,
            subject: parsed.subject || "",
            text: parsed.text || "",
            html: typeof parsed.html === "string" ? parsed.html : "",
            date: parsed.date ? parsed.date.toISOString() : undefined,
          };
          receivedEmails.push(email);
          callback();
        })
        .catch((err) => {
          console.error("[SMTP_SINK_ERR] Failed to parse message:", err);
          callback(err);
        });
    },
  });
}

export async function startSmtp(): Promise<void> {
  if (isSmtpRunning && smtpServer) {
    return;
  }
  return new Promise((resolve, reject) => {
    smtpServer = createSmtpServer();
    smtpServer.listen(SMTP_PORT, "127.0.0.1", () => {
      isSmtpRunning = true;
      console.log(`[SMTP Sink] Listening on port ${SMTP_PORT}`);
      resolve();
    });
    smtpServer.on("error", (err) => {
      console.error("[SMTP Sink Error]:", err);
      reject(err);
    });
  });
}

export async function stopSmtp(): Promise<void> {
  if (!isSmtpRunning || !smtpServer) {
    return;
  }
  return new Promise((resolve) => {
    smtpServer!.close(() => {
      isSmtpRunning = false;
      smtpServer = null;
      console.log(`[SMTP Sink] Stopped listening on port ${SMTP_PORT}`);
      resolve();
    });
  });
}

export async function startHttpControl(): Promise<void> {
  if (httpServer) {
    return;
  }

  httpServer = http.createServer((req, res) => {
    // CORS headers for convenience
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = req.url || "/";

    if (req.method === "GET" && url === "/emails") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(receivedEmails));
      return;
    }

    if (req.method === "POST" && url === "/clear") {
      receivedEmails = [];
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, cleared: true }));
      return;
    }

    if (req.method === "POST" && url === "/stop") {
      stopSmtp()
        .then(() => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, running: false }));
        })
        .catch((err) => {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: String(err) }));
        });
      return;
    }

    if (req.method === "POST" && url === "/start") {
      startSmtp()
        .then(() => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, running: true }));
        })
        .catch((err) => {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: String(err) }));
        });
      return;
    }

    if (req.method === "GET" && url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          count: receivedEmails.length,
          isSmtpRunning,
        })
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return new Promise((resolve, reject) => {
    httpServer!.listen(HTTP_PORT, "127.0.0.1", () => {
      console.log(`[SMTP Sink HTTP Control] Listening on port ${HTTP_PORT}`);
      resolve();
    });
    httpServer!.on("error", (err) => {
      reject(err);
    });
  });
}

export async function stopHttpControl(): Promise<void> {
  if (!httpServer) return;
  return new Promise((resolve) => {
    httpServer!.close(() => {
      httpServer = null;
      resolve();
    });
  });
}

export async function startSink(): Promise<void> {
  await startSmtp();
  await startHttpControl();
}

export async function stopSink(): Promise<void> {
  await stopSmtp();
  await stopHttpControl();
}

// Allow running standalone via CLI if executed directly
if (process.argv[1]?.endsWith("sink.ts")) {
  startSink().catch((err) => {
    console.error("Failed to start sink:", err);
    process.exit(1);
  });
}

