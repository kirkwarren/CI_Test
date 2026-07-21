import { complete } from "../lib/claude.js";

const SOAP_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["subjective", "objective", "assessment", "plan", "billing_suggestions", "red_flags"],
  properties: {
    subjective: { type: "string" },
    objective: { type: "string" },
    assessment: { type: "string" },
    plan: { type: "string" },
    billing_suggestions: {
      type: "object",
      additionalProperties: false,
      required: ["cpt_codes", "notes"],
      properties: {
        cpt_codes: { type: "array", items: { type: "string" } },
        notes: { type: "string" }
      }
    },
    red_flags: { type: "array", items: { type: "string" } }
  }
};

export async function draftSoapNote(store, clinic, { patientId, appointmentId = null, visitType, transcript }) {
  const patient = patientId ? store.get("patients", patientId) : null;
  const priorNote = patientId
    ? store
        .list("notes", (n) => n.patientId === patientId)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0]
    : null;

  const system = `You draft physical therapy SOAP notes for ${clinic.name}. The clinician dictates a rough summary after each visit; you turn it into a clean, defensible draft note.
Rules:
- Use only information present in the dictation${priorNote ? " and the prior note" : ""}. Never fabricate measurements, test results, or patient statements.
- Write in standard PT documentation style: concise, third person, objective measurements where given.
- billing_suggestions.cpt_codes: suggest plausible PT CPT codes (e.g. 97110, 97140, 97530, 97161-97163) ONLY if supported by the documented interventions; these are suggestions for the clinician to verify, never final.
- red_flags: list any statements in the dictation that warrant clinical attention or referral; empty array if none.
This is a DRAFT that a licensed clinician must review and sign.`;

  const parts = [];
  if (patient) parts.push(`Patient: ${patient.firstName} ${patient.lastName}`);
  if (visitType) parts.push(`Visit type: ${visitType}`);
  if (priorNote) {
    parts.push(
      `Prior note (for context):\nS: ${priorNote.subjective}\nO: ${priorNote.objective}\nA: ${priorNote.assessment}\nP: ${priorNote.plan}`
    );
  }
  parts.push(`Dictation:\n${transcript}`);

  const draft = await complete({
    system,
    messages: [{ role: "user", content: parts.join("\n\n") }],
    schema: SOAP_SCHEMA,
    maxTokens: 4000,
    dryRunValue: {
      subjective: "[dry-run] Patient reports improvement since last visit.",
      objective: "[dry-run] See dictation.",
      assessment: "[dry-run] Progressing toward goals.",
      plan: "[dry-run] Continue current plan of care.",
      billing_suggestions: { cpt_codes: ["97110"], notes: "[dry-run] Verify before billing." },
      red_flags: []
    }
  });

  return store.insert("notes", {
    patientId,
    appointmentId,
    visitType: visitType || null,
    transcript,
    ...draft,
    status: "draft_pending_review"
  });
}
