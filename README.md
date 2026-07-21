# Rock & Mineral Identifier

Point your phone or webcam at a rock, snap a photo, and let AI identify it. No lab
equipment, no spectrometer — just a camera and the Claude vision API.

## How it works

1. **Capture** — the app opens your device camera (rear-facing on phones) or accepts an
   uploaded photo. Images are downscaled client-side before being sent.
2. **Analyze** — the photo goes to Claude (`claude-opus-4-8`) with a field-geologist
   system prompt. A structured-output JSON schema guarantees a machine-readable result:
   identification, confidence, observed features, composition, formation, lookalikes,
   and suggested confirmation tests.
3. **Confirm (optional)** — some lookalike minerals can't be separated visually. The app
   suggests simple at-home tests (streak on unglazed tile, hardness scratch test, magnet,
   vinegar fizz). Enter your results in the "field tests" panel and re-analyze for a
   firmer identification. These are things you do by hand — no analyzer hardware needed.

## Running locally

```bash
npm install
npm start
```

Open http://localhost:3000, click the key icon, and paste an Anthropic API key
(get one at https://platform.claude.com).

> **Camera note:** browsers only allow camera access on `https://` or `localhost`.
> The upload button works everywhere.

## API key handling

The key is stored in your browser's localStorage and sent directly to the Anthropic API
(`dangerouslyAllowBrowser` mode). That's fine for personal use. **Before deploying this
for other people**, add a small backend proxy that holds the key server-side and forwards
requests — never ship an API key in client code.

## Tests

```bash
CI=true npm test
```

## Stack

- Create React App + React 19
- Tailwind CSS
- lucide-react icons
- `@anthropic-ai/sdk` (vision + structured outputs)
