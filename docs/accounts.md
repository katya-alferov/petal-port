# Accounts and cloud save (owner-approved, Oct 2026)

The owner approved a server and stored player data so each child can play on their own phone and keep their own character. This amends the "no backend, no accounts, no network after load" rules; every other hard rule stays (no chat, sharing, ads, analytics, monetization, camera, mic or location).

## Principles

- **Optional and offline-first.** Playing as a guest works exactly as before with zero network calls. Signing in only adds cloud save. The game never waits on the network and never blocks play if the server is down.
- **Minimum data (children).** A nickname and a password. No email, real name, birthday, photo upload or device ids. Photos stay on the device. Nothing is used for analytics or advertising.
- **Kind and safe.** Nicknames are checked against a small blocklist and are never shown to other players (there is no multiplayer). A "Delete my account" button erases the server copy.
- **Parent note on the sign-up screen:** "Ask a grown-up first. We only keep your nickname, password and game progress."

## Design

- Backend: Supabase (free tier): Auth for nickname + password and one table `saves(user_id primary key, save jsonb, updated_at)` with row level security so a user reads and writes only their own row. Passwords are hashed by the service; the app never stores them.
- Nickname login uses a synthetic address `<nickname>@players.petalport.invalid` (no real email is collected, no email is ever sent). Password reset therefore is not possible; the sign-up screen says so ("write your password down").
- Client: `src/platform/cloud.ts` (the only file that touches the network). Calls: sign up, sign in, sign out, pull save, push save, delete account. Only the public project URL and anon key are in the code (they are designed to be public; row level security protects data).
- Sync: after the debounced local write, push to the server at most every 30 s while signed in. On sign-in, the newer `updatedAt` wins. If both sides changed, ask the player which character to keep. A server failure shows a small "Saved on this phone" note and retries later.
- Local profiles: a device may hold several signed-in players; the title screen lists them.
- The existing local save stays the source of truth; cloud save is a copy.
- Service worker: cloud requests are never cached.

## Acceptance

- AC-A-1 Guest play makes zero network requests.
- AC-A-2 Sign up, play, sign out, sign in on another browser profile: same character, coins and garden.
- AC-A-3 Wrong password shows a kind message; the local save is untouched.
- AC-A-4 Server unreachable: the game plays normally.
- AC-A-5 Delete account removes the server row.
- Tests: pure merge logic in `src/game`, a fake cloud adapter in unit tests, one e2e with the fake adapter.

## Needed from the owner

Create a free Supabase project and send the **Project URL** and the **anon public key** (safe to share; never the service-role key). Also confirm, because players are children, that the owner takes responsibility for the privacy notice and local child-privacy rules (COPPA / GDPR-K).
