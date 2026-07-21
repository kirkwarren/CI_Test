import http from "node:http";
import { handleInboundMessage } from "./receptionist/receptionist.js";
import { handleOptKeywords } from "./messaging/outbox.js";
import { generateSlots, bookAppointment, completeAppointment, markNoShow } from "./booking/booking.js";
import { requestReviewAfterVisit } from "./reviews/reviews.js";
import { draftSoapNote } from "./notes/soap.js";
import { recordPayment, recordPackageSale, dailySummary, agingReport, toQuickBooksCsv, patientBalance } from "./bookkeeping/ledger.js";
import { buildDigest } from "./jobs/scheduler.js";
import { twimlMessage, twimlSayGather, validateTwilioSignature } from "./lib/twilio.js";
import { isDryRun } from "./lib/config.js";

export function createServer(store, clinic) {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const body = await readBody(req);

      if (req.method === "GET" && url.pathname === "/healthz") {
        return json(res, 200, { ok: true, clinic: clinic.name });
      }

      if (url.pathname.startsWith("/webhooks/") && !verifyTwilio(req, url, body)) {
        return json(res, 403, { error: "invalid twilio signature" });
      }

      if (req.method === "POST" && url.pathname === "/webhooks/sms") {
        const from = body.From;
        const text = body.Body || "";
        const optResult = handleOptKeywords(store, from, text);
        if (optResult === "opted_out") {
          return xml(res, twimlMessage(`You've been unsubscribed from ${clinic.name} texts. Reply START to opt back in.`));
        }
        if (optResult === "opted_in") {
          return xml(res, twimlMessage(`You're resubscribed to ${clinic.name} texts. How can we help?`));
        }
        const { reply } = await handleInboundMessage(store, clinic, { channel: "sms", from, body: text });
        return xml(res, twimlMessage(reply));
      }

      if (req.method === "POST" && url.pathname === "/webhooks/voice") {
        store.insert("callLog", { phone: body.From, callSid: body.CallSid, stage: "answered" });
        return xml(
          res,
          twimlSayGather({
            say: `Thanks for calling ${clinic.name}. Our front desk is away right now, but I can help.`,
            gatherAction: "/webhooks/voice/handle",
            gatherPrompt: "How can I help you today?"
          })
        );
      }

      if (req.method === "POST" && url.pathname === "/webhooks/voice/handle") {
        const speech = body.SpeechResult || "";
        if (!speech.trim()) {
          return xml(
            res,
            twimlSayGather({
              say: "Sorry, I didn't catch that.",
              gatherAction: "/webhooks/voice/handle",
              gatherPrompt: "Could you say that again?"
            })
          );
        }
        const { reply, intent } = await handleInboundMessage(store, clinic, {
          channel: "voice",
          from: body.From,
          body: speech
        });
        const closing =
          intent === "book"
            ? " I'll text you our booking link so you can pick a time."
            : " Anything else I can help with?";
        if (intent === "book" && body.From) {
          const { queueMessage } = await import("./messaging/outbox.js");
          queueMessage(store, clinic, {
            to: body.From,
            kind: "booking_link",
            body: `Book your visit at ${clinic.name} here: ${clinic.bookingUrl}`
          });
        }
        return xml(
          res,
          twimlSayGather({ say: reply + closing, gatherAction: "/webhooks/voice/handle" })
        );
      }

      if (req.method === "GET" && url.pathname === "/api/slots") {
        const days = Number(url.searchParams.get("days") || 7);
        const durationMin = Number(url.searchParams.get("durationMin") || 60);
        const slots = generateSlots({ clinic, appointments: store.list("appointments"), days, durationMin });
        return json(res, 200, { slots });
      }

      if (req.method === "POST" && url.pathname === "/api/appointments") {
        const appointment = bookAppointment(store, clinic, body);
        return json(res, 201, appointment);
      }

      if (req.method === "POST" && url.pathname.match(/^\/api\/appointments\/[^/]+\/complete$/)) {
        const id = url.pathname.split("/")[3];
        const appointment = completeAppointment(store, id);
        if (!appointment) return json(res, 404, { error: "not found" });
        if (body.amount) {
          recordPayment(store, { patientId: appointment.patientId, amount: Number(body.amount), description: "Visit payment" });
        }
        requestReviewAfterVisit(store, clinic, appointment);
        return json(res, 200, appointment);
      }

      if (req.method === "POST" && url.pathname.match(/^\/api\/appointments\/[^/]+\/no-show$/)) {
        const id = url.pathname.split("/")[3];
        const appointment = markNoShow(store, id);
        return appointment ? json(res, 200, appointment) : json(res, 404, { error: "not found" });
      }

      if (req.method === "POST" && url.pathname === "/api/patients") {
        const patient = store.insert("patients", {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          email: body.email || null,
          activePlanOfCare: Boolean(body.activePlanOfCare),
          optedOut: false,
          packages: []
        });
        return json(res, 201, patient);
      }

      if (req.method === "POST" && url.pathname === "/api/notes/draft") {
        const note = await draftSoapNote(store, clinic, body);
        return json(res, 201, note);
      }

      if (req.method === "POST" && url.pathname === "/api/packages/sell") {
        const entry = recordPackageSale(store, clinic, body);
        return json(res, 201, entry);
      }

      if (req.method === "GET" && url.pathname === "/api/reports/daily") {
        return json(res, 200, { money: dailySummary(store, clinic), digest: buildDigest(store, clinic) });
      }

      if (req.method === "GET" && url.pathname === "/api/reports/aging") {
        return json(res, 200, { rows: agingReport(store) });
      }

      if (req.method === "GET" && url.pathname === "/api/reports/quickbooks.csv") {
        res.writeHead(200, { "Content-Type": "text/csv" });
        return res.end(toQuickBooksCsv(store));
      }

      if (req.method === "GET" && url.pathname.match(/^\/api\/patients\/[^/]+\/balance$/)) {
        const id = url.pathname.split("/")[3];
        return json(res, 200, { patientId: id, balance: patientBalance(store, id) });
      }

      return json(res, 404, { error: "not found" });
    } catch (err) {
      console.error("request failed", err);
      return json(res, 400, { error: String(err.message || err) });
    }
  });
}

function verifyTwilio(req, url, params) {
  const token = process.env.TWILIO_AUTH_TOKEN;
  const base = process.env.PUBLIC_URL;
  if (isDryRun() || !token || !base) return true;
  return validateTwilioSignature({
    url: base.replace(/\/$/, "") + url.pathname + url.search,
    params,
    signature: req.headers["x-twilio-signature"],
    authToken: token
  });
}

async function readBody(req) {
  if (req.method === "GET") return {};
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  const type = req.headers["content-type"] || "";
  if (type.includes("application/json")) return JSON.parse(raw);
  return Object.fromEntries(new URLSearchParams(raw));
}

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function xml(res, payload) {
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(payload);
}
