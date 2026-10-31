import { startSink } from "./smtp-sink/sink";

export default async function globalSetup() {
  console.log("\n[Global Setup] Starting local in-memory SMTP sink...");
  await startSink();
  console.log("[Global Setup] SMTP sink ready on port 2525 (HTTP control on 2526).\n");
}

