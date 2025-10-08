Multi-Credentials Guide 📜✨
Purpose 🎯
This document is a comprehensive guide for configuring and utilizing multi-credential support in the project. It provides detailed instructions for developers, operators, and integrators to set up and manage multiple social media accounts across platforms like Facebook, Twitter, Telegram, Instagram, and Google My Business for automated publishing or notifications. The system ensures reliable, secure, and rate-limited operations for seamless multi-account management. 🚀
Overview 🌐
The multi-credential system enables the configuration of multiple accounts per supported social media provider. It centralizes credential management, supports flexible configuration formats, and ensures safe, deterministic publishing to avoid API overloads. This guide covers implementation, configuration, usage, and troubleshooting, with best practices for security and local development. 🛠️
Files and Implementation 📂
Key files for multi-credential functionality include:

utils/credentials.js: Centralized module for loading credentials from environment variables, returning an array of credential objects. 🗂️
Bot Modules:
bots/facebookBot.js: Publishes to multiple Facebook Pages. 📘
bots/twitterBot.js: Manages posts to multiple Twitter accounts. 🐦
bots/telegramBot.js: Sends messages to multiple Telegram chats. 💬
bots/instagramBot.js: Publishes to Instagram Business accounts via Facebook credentials. 📸
bots/gmbBot.js: Manages posts to multiple Google My Business locations. 🗺️


utils/rateLimiter.js: Implements rate-limiting to pace API calls, preventing quota violations. ⏱️
.env.example: Provides sample environment variable configurations for JSON and numbered formats. 📝

Goals 🥅
The multi-credential system aims to:

Enable Flexible Configuration: Support multiple accounts per provider using JSON arrays, numbered environment variables, or legacy single-account variables. 🔄
Ensure Safe Publishing: Provide deterministic and rate-limited operations to avoid API rate limits. 🛡️
Support Scalability: Facilitate integration with UI or API for targeting specific accounts or all configured accounts. 📈
Simplify Maintenance: Centralize credential loading with clear configuration patterns. 🧹

Credential Loading 🔑
All credential loading is handled by the utils/credentials.js module. Here's how it works:
API (Function Signature) 🛠️
The loadProviderCredentials function is the core interface:
loadProviderCredentials(prefix, keys = ['pageId', 'accessToken'])


Parameters:
prefix: Provider prefix (e.g., FACEBOOK, TWITTER, TELEGRAM, GMB). 🏷️
keys: Array of expected credential property names (defaults to ['pageId', 'accessToken']). 🔍


Returns: An array of credential objects mapping keys to values from environment variables or JSON. 📋

Supported Configuration Formats 📑
The loader supports three formats, prioritized as follows:
1. JSON Array Environment Variable (Recommended) 🌟

Description: Use a single <PREFIX>_CREDENTIALS environment variable containing a JSON array of credential objects.
Example (Facebook):FACEBOOK_CREDENTIALS='[{"pageId":"1234567890","accessToken":"EAA..."},{"pageId":"2345678901","accessToken":"EAA..."}]'


Advantages:
Clean and concise. ✅
Ideal for programmatic provisioning or secret managers. 🔒
Supports complex credential structures. 📚


Considerations:
Ensure valid JSON and proper escaping in shell environments. ⚠️



2. Numbered Environment Variables (Legacy-Friendly) 🔢

Description: Use numbered environment variables for up to 10 accounts (configurable). For each account N (1 to 10):
<PREFIX>_<KEY>_N (e.g., <PREFIX>_PAGE_ID_1, <PREFIX>_ACCESS_TOKEN_1).


Example (Facebook):FACEBOOK_PAGE_ID_1=1234567890
FACEBOOK_ACCESS_TOKEN_1=EAA...
FACEBOOK_PAGE_ID_2=2345678901
FACEBOOK_ACCESS_TOKEN_2=EAA...


Advantages:
Compatible with systems that don’t support large JSON variables. 🛠️
Familiar for legacy setups. 🕰️


Considerations:
More verbose than JSON. 📜
Manual configuration can be error-prone. 🚫



3. Single (Legacy) Environment Variables (Fallback) 🔙

Description: Fallback for single-account setups using single variables (e.g., <PREFIX>_PAGE_ID, <PREFIX>_ACCESS_TOKEN).
Example (Facebook):FACEBOOK_PAGE_ID=1234567890
FACEBOOK_PAGE_ACCESS_TOKEN=EAA...


Advantages:
Simplest for single-account setups. 👍


Considerations:
Limited to one account per provider. 🚫
Not recommended for multi-account setups. ⚠️



Provider-Specific Configuration 🖥️
Each provider uses specific keys, but the loader supports custom keys via the keys parameter.
Facebook (Pages) 📘

Keys: pageId, accessToken
JSON Example:FACEBOOK_CREDENTIALS='[{"pageId":"123","accessToken":"EAA..."},{"pageId":"456","accessToken":"EAA..."}]'


Numbered Example:FACEBOOK_PAGE_ID_1=123
FACEBOOK_ACCESS_TOKEN_1=EAA...
FACEBOOK_PAGE_ID_2=456
FACEBOOK_ACCESS_TOKEN_2=EAA...


Legacy Variables: FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN

Twitter 🐦

Keys: user_id, bearer_token
JSON Example:TWITTER_CREDENTIALS='[{"user_id":"123","bearer_token":"AAAA..."}]'


Numbered Example:TWITTER_USER_ID_1=123
TWITTER_BEARER_TOKEN_1=AAAA...


Legacy Variables: TWITTER_USER_ID, TWITTER_BEARER_TOKEN

Telegram 💬

Keys: bot_token, chat_id
JSON Example:TELEGRAM_CREDENTIALS='[{"bot_token":"123:ABC","chat_id":"987"}]'


Numbered Example:TELEGRAM_BOT_TOKEN_1=123:ABC
TELEGRAM_CHAT_ID_1=987



Instagram (Business Accounts) 📸

Approach: Requires a Facebook access token and an Instagram Business ID. Configure Facebook credentials with an optional igBusinessId key.
JSON Example:FACEBOOK_CREDENTIALS='[{"pageId":"123","accessToken":"EAA...","igBusinessId":"178414..."}]'


Alternative: Use Facebook credentials and set a single IG_BUSINESS_ID:IG_BUSINESS_ID=178414...



Google My Business (GMB) 🗺️

Keys: locationId, accessToken
JSON Example:GMB_CREDENTIALS='[{"locationId":"accounts/123","accessToken":"ya29..."}]'


Numbered Example:GMB_LOCATION_ID_1=accounts/123
GMB_ACCESS_TOKEN_1=ya29...



Bot Behavior with Multiple Credentials 🤖
Each bot handles multiple credentials as follows:

Credential Loading: Calls loadProviderCredentials() to retrieve an array of credentials. 📋
Publishing: Iterates over the credential array, performing actions for each account. 📢
Rate Limiting: Uses utils/rateLimiter.js (runWithRateLimit) to pace API calls:const { runWithRateLimit } = require('../utils/rateLimiter');
await runWithRateLimit(fbCredentials, async (cred) => {
  // Post using cred.pageId and cred.accessToken
}, { concurrency: 1, delayMs: 800 });



Configuration and Tuning ⚙️
Tune rate-limiting behavior globally or per-call:

Global Environment Variables:
MULTI_POST_CONCURRENCY: Number of concurrent API calls (default: 1). 🔄
MULTI_POST_DELAY_MS: Delay between API calls in milliseconds (default: 500). ⏱️


Per-Call Overrides:runWithRateLimit(credentials, async (cred) => { /* ... */ }, { concurrency: 2, delayMs: 1000 });



UI and Admin Integration 🖼️
For UI or admin panel integration:

Account Listing: Display connected accounts with metadata (e.g., page name, ID, last post time, last error). 📊
Selective Publishing: Allow users to select accounts via checkboxes (default: "all connected accounts"). ✅
Scheduling Posts: Support an optional "Target Accounts" field:
Empty: Publish to all accounts. 🌐
JSON array: ["123", "456"]. 📋
Comma-separated list: 123,456. 📝



API Contract for Targeted Publishing 🌐
For programmatic publishing:

Endpoint: POST /publish
Body:{
  provider: 'facebook',
  accountIds: ['123', '456'], // Optional; omit for all accounts
  message: 'Hello world',
  mediaUrl: 'https://...' // Optional
}


Server Logic (Pseudocode):const accounts = accountIds?.length ? credentials.filter(c => accountIds.includes(c.pageId)) : credentials;
await runWithRateLimit(accounts, async (c) => postToAccount(c), { concurrency, delayMs });



Security and Secrets Management 🔒
Ensure secure credential handling:

Protect Secrets: Never commit .env files to version control; use .gitignore. 🚫
Secrets Managers: Use AWS Secrets Manager, HashiCorp Vault, or Google Secret Manager to inject JSON credentials. 🔐
Token Rotation: Rotate tokens regularly and scope to minimal privileges (e.g., page-level tokens for Facebook). 🔄
Audit Logging: Bots log actions to the Supabase engagements table for tracking and debugging. 📜
CI/CD Security: Use encrypted secrets in CI/CD pipelines. 🛡️

Testing and Local Development 🧪
For local development and testing:

Mock-Safe Modules: Use included mock-safe modules for testing without real credentials. 🛠️
Smoke Tests:# Lightweight language smoke test
node scripts/smoke-lang.js

# Dispatcher check for post queue
node scripts/run-dispatcher-check.js

# Lightweight multi-language tests
node tests/run-multi-lang-node.js


Live Testing:
Create test accounts/pages with limited permissions. ✅
Add credentials to a local .env file (excluded from Git). 📝
Example .env:FACEBOOK_CREDENTIALS='[{"pageId":"123-test","accessToken":"EAA-test"}]'
TWITTER_CREDENTIALS='[{"user_id":"test","bearer_token":"AAA-test"}]'
TELEGRAM_CREDENTIALS='[{"bot_token":"111:BBB","chat_id":"999"}]'
MULTI_POST_DELAY_MS=1000
MULTI_POST_CONCURRENCY=1





Troubleshooting 🛠️
Common issues and solutions:

All Accounts Fail:
Check network connectivity and API rate limits. 🌐
# Multi-Credentials Guide

Comprehensive, polished guide for configuring and using multi-credential support in this project. It explains the flexible credential formats, how bots consume credentials, rate-limiting, security, recommended practices, and integration patterns for UI and API.

Table of contents
-----------------
- Quick start
- Supported credential formats
- Examples (copy/paste)
- Provider-specific notes
- How bots behave with multiple credentials
- Rate limiting and backoff
- Admin/UI and API integration
- Security and secrets management
- Testing and local development
- Troubleshooting
- Extending and unit tests

Quick start
-----------
1. Choose a credential format (JSON array recommended).
2. Add credentials to your environment or secret manager using the examples below.
3. Tune rate limiting with `MULTI_POST_CONCURRENCY` and `MULTI_POST_DELAY_MS` if needed.
4. Run the built-in smoke tests or start the bots.

Supported credential formats (priority)
------------------------------------
The loader in `utils/credentials.js` supports three patterns (checked in this order):

1) JSON array env var (recommended)

  - Env var: `<PREFIX>_CREDENTIALS`
  - Value: a JSON array of credential objects

  Example (Facebook):

  ```bash
  export FACEBOOK_CREDENTIALS='[{"pageId":"123456","accessToken":"EAA..."},{"pageId":"234567","accessToken":"EAA..."}]'
  ```

2) Numbered env vars (legacy-friendly)

  - Pattern: `<PREFIX>_<KEY>_N` where N is 1..10
  - Example (Facebook):

  ```bash
  export FACEBOOK_PAGE_ID_1=123456
  export FACEBOOK_ACCESS_TOKEN_1=EAA...
  export FACEBOOK_PAGE_ID_2=234567
  export FACEBOOK_ACCESS_TOKEN_2=EAA...
  ```

3) Single legacy env vars (fallback)

  - Example (Facebook):

  ```bash
  export FACEBOOK_PAGE_ID=123456
  export FACEBOOK_PAGE_ACCESS_TOKEN=EAA...
  ```

Provider-specific examples and keys
----------------------------------
The loader accepts a `keys` parameter, so providers can request different key names. The repository uses the following conventions:

- Facebook (Pages): `pageId`, `accessToken`
- Twitter: `user_id`, `bearer_token`
- Telegram: `bot_token`, `chat_id`
- Instagram (IG Business): use Facebook credentials (optionally include an `igBusinessId` key)
- Google My Business (GMB): `locationId`, `accessToken`

Provider examples (copy/paste)
-----------------------------

Facebook (JSON):

```bash
FACEBOOK_CREDENTIALS='[
  {"pageId":"1234567890","accessToken":"EAA..."},
  {"pageId":"2345678901","accessToken":"EAA..."}
]'
```

Twitter (numbered):

```bash
TWITTER_USER_ID_1=111111
TWITTER_BEARER_TOKEN_1=AAAA...
TWITTER_USER_ID_2=222222
TWITTER_BEARER_TOKEN_2=BBBB...
```

Telegram (single):

```bash
TELEGRAM_BOT_TOKEN=123456:ABCDEF
TELEGRAM_CHAT_ID=987654321
```

GMB (JSON):

```bash
GMB_CREDENTIALS='[{"locationId":"accounts/123","accessToken":"ya29..."}]'
```

How bots use credentials
------------------------
- Each bot calls `loadProviderCredentials(prefix, keys)` and receives an array of credential objects.
- Bots iterate that array and perform the publish/notification actions for each credential.
- Bots log per-account actions to Supabase (`engagements`) with account metadata for auditing.

Rate limiting & pacing
----------------------
To avoid API bursts and quota problems, bots use `utils/rateLimiter.js` (`runWithRateLimit`).

Global environment variables (defaults provided in code):

- `MULTI_POST_CONCURRENCY` — number of concurrent workers (default: `1`).
- `MULTI_POST_DELAY_MS` — delay (ms) inserted between work items (default: `500`).

Example usage inside a bot:

```javascript
const { runWithRateLimit } = require('../utils/rateLimiter');
await runWithRateLimit(accounts, async (acc) => {
  await postToAccount(acc);
}, { concurrency: 1, delayMs: 800 });
```



Server pseudocode:

```javascript
const accounts = accountIds?.length ? credentials.filter(c => accountIds.includes(c.pageId)) : credentials;
await runWithRateLimit(accounts, postToAccount, { concurrency, delayMs });
```

Security & secrets management
----------------------------
- Never commit `.env` to version control. Add it to `.gitignore`.
- Prefer secret managers (AWS Secrets Manager, GCP Secret Manager, Vault).
- Use least-privilege tokens and rotate regularly.
- Record all publish and error events to your audit logs (Supabase `engagements` table).

Testing & local development
---------------------------
The repository includes mock-safe modules for development without real credentials.

Quick checks (no network required for mocks):

```bash
# Language smoke test
node scripts/smoke-lang.js

# Dispatcher check
node scripts/run-dispatcher-check.js

# Lightweight tests
node tests/run-multi-lang-node.js
```

To test actual posting, create test accounts/pages and place credentials in a local `.env` (excluded from Git):

```bash
FACEBOOK_CREDENTIALS='[{"pageId":"123-test","accessToken":"EAA-test"}]'
TWITTER_CREDENTIALS='[{"user_id":"test","bearer_token":"AAA-test"}]'
TELEGRAM_CREDENTIALS='[{"bot_token":"111:BBB","chat_id":"999"}]'
MULTI_POST_DELAY_MS=1000
MULTI_POST_CONCURRENCY=1
```

Troubleshooting
---------------
- If all accounts fail: check network, check global rate limits, inspect `engagements` logs in Supabase.
- If some accounts fail: verify tokens, check permission scopes, test those accounts individually.
- If you see many 429s: increase `MULTI_POST_DELAY_MS` and reduce `MULTI_POST_CONCURRENCY`; add exponential backoff for transient errors.

Extending the loader
--------------------
To add new provider-specific keys:

```javascript
const creds = loadProviderCredentials('MYPROVIDER', ['clientId','clientSecret']);
```
