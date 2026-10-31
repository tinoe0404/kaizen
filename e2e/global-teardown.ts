import { stopSink } from "./smtp-sink/sink";

export default async function globalTeardown() {
  console.log("\n[Global Teardown] Stopping local in-memory SMTP sink...");
  await stopSink();
  console.log("[Global Teardown] SMTP sink stopped.\n");
}

