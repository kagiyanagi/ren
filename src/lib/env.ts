type TelegramConfig = {
  token: string;
  chatId: string;
};

const TOKEN_KEYS = ["TELEGRAM_BOT_TOKEN", "BOT_TOKEN"] as const;
const CHAT_ID_KEYS = ["TELEGRAM_CHAT_ID", "CHAT_ID"] as const;

function readEnvKey(keys: readonly string[]): string {
  const metaEnv = import.meta.env as Record<string, string | undefined>;
  const procEnv =
    typeof process !== "undefined"
      ? (process.env as Record<string, string | undefined>)
      : {};

  for (const key of keys) {
    const value = metaEnv[key] ?? procEnv[key];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

export function readTelegramConfig(): TelegramConfig {
  const token = readEnvKey(TOKEN_KEYS);
  const chatId = readEnvKey(CHAT_ID_KEYS);

  if (!token || !chatId) {
    throw new Error(
      "Server is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.",
    );
  }
  if (!token.includes(":")) {
    throw new Error(
      "Server is not configured: TELEGRAM_BOT_TOKEN looks invalid.",
    );
  }

  return { token, chatId };
}
