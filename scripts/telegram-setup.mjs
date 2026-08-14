/**
 * Finds your Telegram chat id and writes it into .env.local.
 *
 * Telegram will not tell a bot who its users are until they message it first —
 * that is a privacy rule, not a limitation we can code around. So the order is:
 *
 *   1. Message @BotFather, send /newbot, follow the prompts.
 *   2. Paste the token it gives you into .env.local as TELEGRAM_BOT_TOKEN.
 *   3. Open your new bot in Telegram and send it any message (e.g. "hi").
 *   4. Run: npm run telegram:setup
 *
 * Run with:  node scripts/telegram-setup.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ENV = ".env.local";

if (!existsSync(ENV)) {
  console.error(`✗ ${ENV} not found. Copy .env.example to .env.local first.`);
  process.exit(1);
}

const raw = readFileSync(ENV, "utf8");
const token = raw.match(/^TELEGRAM_BOT_TOKEN=(.*)$/m)?.[1]?.trim();

if (!token) {
  console.error(`✗ TELEGRAM_BOT_TOKEN is empty in ${ENV}.

   Message @BotFather on Telegram, send /newbot, and paste the token it gives
   you into ${ENV}, then run this again.`);
  process.exit(1);
}

const api = (method) => `https://api.telegram.org/bot${token}/${method}`;

// Confirm the token works before anything else, so a bad paste is obvious.
const meRes = await fetch(api("getMe"));
const me = await meRes.json();
if (!me.ok) {
  console.error(`✗ Telegram rejected the token: ${me.description ?? "unknown error"}`);
  console.error("  Check you copied the whole thing, including the digits before the colon.");
  process.exit(1);
}
console.log(`✓ Bot found: @${me.result.username}`);

const updatesRes = await fetch(api("getUpdates"));
const updates = await updatesRes.json();
const chats = new Map();
for (const u of updates.result ?? []) {
  const chat = u.message?.chat ?? u.channel_post?.chat;
  if (chat) chats.set(chat.id, chat);
}

if (chats.size === 0) {
  console.error(`
✗ No messages yet, so Telegram will not reveal a chat id.

   Open Telegram, find @${me.result.username}, and send it any message.
   Then run this again.`);
  process.exit(1);
}

if (chats.size > 1) {
  console.log("\nMore than one chat has messaged the bot:");
  for (const c of chats.values()) {
    console.log(`  ${c.id}  ${c.title ?? [c.first_name, c.last_name].filter(Boolean).join(" ")}`);
  }
  console.log("\nUsing the most recent. Edit TELEGRAM_CHAT_ID by hand if that is wrong.");
}

const chat = [...chats.values()].pop();
const id = String(chat.id);
const who = chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(" ");

const next = raw.match(/^TELEGRAM_CHAT_ID=.*$/m)
  ? raw.replace(/^TELEGRAM_CHAT_ID=.*$/m, `TELEGRAM_CHAT_ID=${id}`)
  : `${raw.trimEnd()}\nTELEGRAM_CHAT_ID=${id}\n`;
writeFileSync(ENV, next);

console.log(`✓ Chat id ${id} (${who}) written to ${ENV}`);

// Prove the whole path works, end to end.
const test = await fetch(api("sendMessage"), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: id,
    text: "🖤 *Clothsomnia* is connected.\n\nOrders from the site will arrive here.",
    parse_mode: "Markdown",
  }),
});

console.log(
  (await test.json()).ok
    ? "✓ Test message sent — check Telegram. Restart the dev server and you are done."
    : "✗ Could not send the test message. The id was saved; try sending manually.",
);
