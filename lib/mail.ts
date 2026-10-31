import nodemailer, { type Transporter } from "nodemailer";

export interface SendMailOptions {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

const REQUIRED_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_FROM_NAME",
  "BOOKING_EMAIL",
] as const;

let cachedTransporter: Transporter | null = null;

export function getBookingEmail(): string {
  const email = process.env.BOOKING_EMAIL;
  if (!email) {
    const errorMsg = "Missing required environment variable: BOOKING_EMAIL";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return email;
}

export function getMailTransporter(): Transporter {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName]) {
      const errorMsg = `Missing required environment variable: ${varName}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  const host = process.env.SMTP_HOST!;
  const port = parseInt(process.env.SMTP_PORT!, 10);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return cachedTransporter;
}

/**
 * Resets the cached transporter (useful in tests).
 */
export function resetMailTransporter(): void {
  cachedTransporter = null;
}

/**
 * Sends an email using SMTP or prints to console in dry-run mode.
 */
export async function sendMail(options: SendMailOptions): Promise<void> {
  const isDryRun =
    process.env.MAIL_DRY_RUN === "true" &&
    process.env.NODE_ENV !== "production";

  if (isDryRun) {
    console.log("=== [MAIL DRY RUN] ===");
    console.log(`To: ${options.to}`);
    if (options.replyTo) {
      console.log(`Reply-To: ${options.replyTo}`);
    }
    console.log(`Subject: ${options.subject}`);
    console.log("Body:");
    console.log(options.text);
    console.log("=== [END MAIL DRY RUN] ===");
    return;
  }

  const transporter = getMailTransporter();
  const fromName = process.env.MAIL_FROM_NAME!;
  const fromAddress = process.env.SMTP_USER!;

  // 15-second fail-safe timeout prevents serverless lambdas from hanging on stalled SMTP handshakes
  const sendPromise = transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      const err = new Error("SMTP connection timed out after 15 seconds");
      (err as { code?: string }).code = "ETIMEDOUT";
      reject(err);
    }, 15000);
    // Unref timer in Node.js so it does not hold the process open
    if (typeof timer.unref === "function") {
      timer.unref();
    }
  });

  await Promise.race([sendPromise, timeoutPromise]);
}

