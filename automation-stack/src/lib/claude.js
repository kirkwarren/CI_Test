import { isDryRun } from "./config.js";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

let clientPromise;

function getClient() {
  if (!clientPromise) {
    clientPromise = import("@anthropic-ai/sdk").then((mod) => new mod.default());
  }
  return clientPromise;
}

export async function complete({ system, messages, schema, maxTokens = 4000, dryRunValue }) {
  if (isDryRun()) {
    if (dryRunValue === undefined) throw new Error("DRY_RUN set but no dryRunValue provided");
    return dryRunValue;
  }
  const client = await getClient();
  const request = {
    model: MODEL,
    max_tokens: maxTokens,
    thinking: { type: "adaptive" },
    system,
    messages
  };
  if (schema) {
    request.output_config = { format: { type: "json_schema", schema } };
  }
  const response = await client.messages.create(request);
  if (response.stop_reason === "refusal") {
    throw new RefusalError(response.stop_details?.explanation || "Model declined the request");
  }
  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
  return schema ? JSON.parse(text) : text;
}

export class RefusalError extends Error {
  constructor(message) {
    super(message);
    this.name = "RefusalError";
  }
}
