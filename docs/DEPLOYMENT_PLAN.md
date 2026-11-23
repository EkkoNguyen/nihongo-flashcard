# Deployment Plan

**Status:** Recommended deployment for an early public web release. No cloud resources have been created.

## Recommended Setup

| Component | Service | Region / role |
|---|---|---|
| React/Vite frontend | Render Static Site | Global CDN; deploy built static assets and route SPA fallback to `index.html`. |
| Fastify API | Render Web Service, paid small instance | Singapore, close to the intended Vietnam/Southeast Asia audience and the database. Render supports Singapore and a Fastify deployment guide. |
| MongoDB | MongoDB Atlas | AWS Singapore (`ap-southeast-1`), in the same region as the API where the selected Atlas tier permits. |
| Audio/images | Cloudflare R2 | Private S3-compatible bucket; API authorizes assets and issues short-lived signed URLs. |
| Reminder jobs | Render Cron Job | Scheduled UTC worker queries due reminders using each user's stored IANA timezone, then sends via a transactional email provider. |
| Source/deploy | GitHub connected to Render | Push-based deploys, preview/staging environment, production deploy from protected main branch. |

Render is the recommended host because it combines a global-CDN static site, Singapore web services, and scheduled jobs in one deployment workflow. Static sites are free; the production API should use a paid instance because Render's free web services sleep after 15 minutes idle and can take about a minute to wake. Render currently lists its smallest paid web service at about $7/month; confirm live pricing and included usage before launch. [Render regions](https://render.com/docs/regions), [static sites](https://render.com/docs/static-sites), [free-instance limitations](https://render.com/docs/free), [pricing](https://render.com/pricing)

MongoDB Atlas supports AWS Singapore (`ap-southeast-1`). Keep the API and cluster in the same region to reduce database round-trip latency. Free Atlas clusters are limited to a subset of regions and have operational limits; if Singapore is unavailable for the selected tier, use a paid Singapore tier for production rather than placing production data far away just to use a free cluster. [Atlas AWS regions](https://www.mongodb.com/docs/atlas/reference/amazon-aws/), [Atlas free-cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)

R2 provides an S3-compatible API and currently advertises no egress charges; its standard storage free allowance is limited, so monitor storage and request volume. [R2 S3 API](https://developers.cloudflare.com/r2/get-started/s3/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/)

## Environments and Domains

- Development: local Vite client, local Fastify API, and a separate development database/bucket.
- Staging: separate Render services and non-production Atlas database/bucket; never use production user data for test accounts.
- Production: `app.<domain>` for the SPA, `api.<domain>` for the API, exact-origin CORS allowlist, TLS, separate secrets, and a production data backup plan.
- Keep uploads private by default; public shared-deck assets need deliberate visibility rules. Do not place database credentials in frontend build variables.

## Reminders and Jobs

Store user timezone as an IANA name (for example `Asia/Ho_Chi_Minh`) and calculate reminder instants in UTC. A scheduled job can run every few minutes, claim due notifications idempotently, and record delivery status to avoid duplicate email. Render Cron Jobs use UTC schedules and are billed for active run time; ensure the task exits after processing. [Render cron jobs](https://render.com/docs/cronjobs)

Start with in-app reminders and transactional email. If users want reminders in their own calendars, integrate the **Google Calendar API** with user OAuth to create/update events; Google Calendar can then deliver its own email or popup reminders for those events. Creating events requires user authorization for calendar write access. [Google Calendar create events](https://developers.google.com/workspace/calendar/api/guides/create-events), [event reminders](https://developers.google.com/workspace/calendar/api/concepts/reminders)

An MCP Google Calendar connector is for an AI agent to access a connected calendar during an agent session. It is not a runtime dependency the deployed website can call for all of its users. The product must use Google's public Calendar API with each user's OAuth consent. Similarly, app-generated email should use the app's transactional email provider; Gmail API would require the learner to grant Gmail sending scopes, which is unnecessary for study reminders. [Gmail API send scopes](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send)

Do not use cron polling as a replacement for real-time push notifications.

## Release Checks

1. CI runs formatting/lint, `tsc --noEmit`, unit/integration tests, and production builds.
2. Playwright covers sign-in, create/import deck, deck-scoped study mode, review persistence, shared-deck copy, and schedule settings in staging.
3. Verify MongoDB access controls, secret separation, media upload size/type limits, rate limits, and CORS.
4. Confirm backup/restore steps and error/uptime monitoring before inviting real users.

## Trade-offs

- Render is simpler than splitting the static frontend, API, and scheduled jobs across different hosts. Cloudflare Pages + Workers could reduce edge latency, but the Fastify Node API would need an adapter/rewrite and would add platform-specific constraints.
- The production API is not zero-cost; avoid the free sleeping tier for a user-facing learning service. Use free static hosting and development database tiers only for prototypes where cold starts and limits are acceptable.
- Exact Atlas tier, region availability at that tier, email provider, and storage spend must be checked against the owner's budget before provisioning.
