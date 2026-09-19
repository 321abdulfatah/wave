# Deploying WAVE

Alexa+ needs a public HTTPS endpoint for the MCP server — `localhost` will not do — so this has
to be live before the Alexa+ track can be demonstrated at all.

**Recommended: Vercel, with a subdomain of `alhakawatieh.com` pointed at it.**

Vercel rather than the Hostinger account, because Next.js needs a Node runtime with streaming
responses: the MCP transport, the Ring event SSE feed and the caption stream all hold
connections open. Shared PHP hosting cannot serve any of the three. Keeping the domain is free
— point a subdomain at Vercel and the URL is still yours.

---

## 1. Deploy

```bash
npx vercel --prod
```

First run asks four questions: link to an existing project (no), scope (your account), project
name (`wave`), and directory (`./`). It detects Next.js on its own — no `vercel.json` needed.

## 2. Environment variables

Set these in the Vercel dashboard under **Settings → Environment Variables**, or with
`npx vercel env add`. Never commit them.

| Variable | Needed for | Notes |
|---|---|---|
| `RING_ACCESS_TOKEN` | Live Ring data | Playground tokens expire in ~30 min, so production should use the OAuth pair below instead. Unset → the app serves mock mode, which is a deliberate feature, not a failure. |
| `RING_CLIENT_ID` | OAuth | From the Ring app credentials CSV |
| `RING_CLIENT_SECRET` | OAuth | Secret |
| `RING_WEBHOOK_SECRET` | Webhook verification | The HMAC Signature Key. **Set this in production** — with the placeholder value the handler accepts unsigned webhooks, which is fine on localhost and unacceptable on a public URL. |
| `AWS_REGION` | Captions | e.g. `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Captions | An IAM user scoped to `transcribe:StartStreamTranscription` only |
| `AWS_SECRET_ACCESS_KEY` | Captions | Secret |
| `TRANSCRIBE_LANGUAGE` | Captions | Defaults to `en-US` |

Without the AWS pair the caption panel says so in the UI rather than sitting silently empty —
see `lib/captions/transcriber.ts`.

## 3. Point the subdomain

In Vercel: **Settings → Domains → Add** → `wave.alhakawatieh.com`.

Then in Hostinger's DNS zone editor for `alhakawatieh.com`:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `wave` | `cname.vercel-dns.com` | 3600 |

Propagation is usually minutes. Vercel issues the TLS certificate automatically once the record
resolves. **Do not touch the root `@` record** — that is the existing Al-Hakawatieh site and
nothing here needs it.

## 4. Point Ring's webhook at it

In the Ring Developer Console, set the app's webhook URL to:

```
https://wave.alhakawatieh.com/api/webhook
```

The handler verifies the `X-Signature` HMAC in constant time and is idempotent on
`meta.request_id`, which Ring reuses across its retries.

## 5. The MCP endpoint

```
https://wave.alhakawatieh.com/api/mcp
```

Protocol version `2025-11-25` over Streamable HTTP. Verify it from anywhere:

```bash
curl -s -X POST https://wave.alhakawatieh.com/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Five tools should come back: `who_came_today`, `describe_visit`, `list_known_visitors`,
`set_visitor_policy`, `explain_gestures`.

---

## Cost

Vercel's free tier covers this comfortably. The one thing that is **not** free is Amazon
Transcribe — it bills per second of audio. The free tier is 60 minutes a month for 12 months,
and the hackathon credits cover far more than a demo needs, but a caption session left running
against a live stream will spend them.

**Set a zero-spend AWS budget before enabling captions in production**, and leave the AWS
variables unset until you actually need them. The app runs completely without them.

## A note on the store

Events currently live in memory, in a `globalThis` singleton (`lib/store.ts`). That survives a
hot reload but not a redeploy, and on Vercel each serverless invocation may get a fresh process
— so the event list can appear empty right after a cold start. It is documented in the file as
the first thing to swap for DynamoDB, and that swap is four functions wide.

For the demo this is fine and arguably better: mock mode gives a deterministic, repeatable
scenario that does not depend on Ring's availability while the video is being recorded.
