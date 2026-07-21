import { getClinic, isDryRun } from "./lib/config.js";
import { getStore } from "./lib/store.js";
import { createServer } from "./server.js";
import { startScheduler } from "./jobs/scheduler.js";

const clinic = getClinic();
const store = getStore();
const port = Number(process.env.PORT || 3000);

const server = createServer(store, clinic);
const stopScheduler = startScheduler(store, clinic);

server.listen(port, () => {
  console.log(`${clinic.name} automation stack listening on :${port}${isDryRun() ? " (DRY RUN)" : ""}`);
  console.log("Webhooks: POST /webhooks/sms, /webhooks/voice, /webhooks/voice/handle");
  console.log("API: /api/slots, /api/appointments, /api/notes/draft, /api/reports/*");
});

process.on("SIGINT", () => {
  stopScheduler();
  server.close(() => process.exit(0));
});
