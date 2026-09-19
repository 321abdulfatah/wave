/**
 * Read an environment variable, defensively.
 *
 * Every value in this app's config arrives by being pasted: into a shell, into
 * a dashboard field, into a `vercel env add` prompt. Windows tooling in
 * particular likes to prepend a UTF-8 byte-order mark, and a BOM is invisible
 * everywhere except the one place it matters — inside an HTTP request, where
 * `\uFEFFwhisper-large-v3` is simply not a model anyone serves.
 *
 * That cost an afternoon once. Stripping it here costs nothing, and it also
 * catches the trailing newline a heredoc leaves behind.
 */
const INVISIBLE = /[\uFEFF\u200B-\u200D\u2060]/g

export function env(name: string): string | undefined {
  const raw = process.env[name]
  if (raw == null) return undefined
  const clean = raw.replace(INVISIBLE, '').trim()
  return clean.length ? clean : undefined
}

export function envOr(name: string, fallback: string): string {
  return env(name) ?? fallback
}
