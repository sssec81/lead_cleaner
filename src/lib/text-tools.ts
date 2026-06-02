const EMAIL_REGEX = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
const SINGLE_EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const PHONE_REGEX = /(?:\+?\d[\d().\-\s]{6,}\d)/g;
const URL_REGEX =
  /\b(?:https?:\/\/|www\.)[^\s<>"'()]+(?:\([^\s<>"']*\)|[^\s<>"'.,;:!?])/gi;
const DOMAIN_FROM_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?([^\/?#:]+)(?::\d+)?(?:[\/?#]|$)/i;

export type ExtractionStats = {
  totalFound: number;
  duplicatesRemoved: number;
  invalidRemoved: number;
  cleanResults: number;
};

export function extractEmailsFromText(input: string) {
  const matches = input.match(EMAIL_REGEX) ?? [];
  const cleaned = matches
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: ExtractionStats = {
    totalFound: matches.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved: 0,
    cleanResults: deduped.length,
  };

  return { results: deduped, stats };
}

export function cleanEmailList(input: string) {
  const candidates = input
    .split(/[\n,\t; ]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const validEmails = candidates.filter((entry) => SINGLE_EMAIL_REGEX.test(entry));

  const deduped = Array.from(new Set(validEmails)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: ExtractionStats = {
    totalFound: candidates.length,
    duplicatesRemoved: validEmails.length - deduped.length,
    invalidRemoved: candidates.length - validEmails.length,
    cleanResults: deduped.length,
  };

  return { results: deduped, stats };
}

export function removeDuplicateEmails(input: string) {
  const candidates = input
    .split(/[\n,\t; ]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const validEmails = candidates.filter((entry) =>
    SINGLE_EMAIL_REGEX.test(entry),
  );

  const deduped = Array.from(new Set(validEmails)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: ExtractionStats = {
    totalFound: validEmails.length,
    duplicatesRemoved: validEmails.length - deduped.length,
    invalidRemoved: candidates.length - validEmails.length,
    cleanResults: deduped.length,
  };

  return { results: deduped, stats };
}

export function extractPhoneNumbersFromText(input: string) {
  const matches = input.match(PHONE_REGEX) ?? [];
  const cleaned = matches
    .map((entry) => normalizePhoneNumber(entry))
    .filter((entry): entry is string => Boolean(entry));

  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: ExtractionStats = {
    totalFound: matches.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved: 0,
    cleanResults: deduped.length,
  };

  return { results: deduped, stats };
}

export function extractUrlsFromText(input: string) {
  const matches = input.match(URL_REGEX) ?? [];
  const cleaned = matches
    .map((entry) => normalizeUrlValue(entry))
    .filter((entry): entry is string => Boolean(entry));

  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: ExtractionStats = {
    totalFound: matches.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved: 0,
    cleanResults: deduped.length,
  };

  return { results: deduped, stats };
}

export function extractDomainsFromEmails(input: string) {
  const emailMatches = input.match(EMAIL_REGEX) ?? [];
  const urlMatches = input.match(URL_REGEX) ?? [];

  const normalizedEmailDomains = emailMatches
    .map((entry) => extractDomainFromEmail(entry))
    .filter((entry): entry is string => Boolean(entry));

  const normalizedUrlDomains = urlMatches
    .map((entry) => extractDomainFromUrl(entry))
    .filter((entry): entry is string => Boolean(entry));

  const cleaned = [...normalizedEmailDomains, ...normalizedUrlDomains];
  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: ExtractionStats = {
    totalFound: cleaned.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved: 0,
    cleanResults: deduped.length,
  };

  return { results: deduped, stats };
}

function normalizePhoneNumber(input: string) {
  const trimmed = input.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (digitsOnly.length < 7) {
    return null;
  }

  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

export function normalizeUrlValue(input: string) {
  const trimmed = stripTrailingUrlPunctuation(input.trim());

  if (!trimmed) {
    return null;
  }

  const lowerTrimmed = trimmed.toLowerCase();
  const withProtocol = lowerTrimmed.startsWith("www.")
    ? `https://${trimmed.slice(4)}`
    : trimmed;

  if (
    !withProtocol.toLowerCase().startsWith("http://") &&
    !withProtocol.toLowerCase().startsWith("https://")
  ) {
    return null;
  }

  try {
    const url = new URL(withProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    const normalizedProtocol = url.protocol.toLowerCase();
    const normalizedHost = url.host.toLowerCase();

    return `${normalizedProtocol}//${normalizedHost}${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function stripTrailingUrlPunctuation(input: string) {
  let result = input.replace(/[.;:!?]+$/g, "");

  while (result.endsWith(")")) {
    const openCount = (result.match(/\(/g) ?? []).length;
    const closeCount = (result.match(/\)/g) ?? []).length;

    if (closeCount <= openCount) {
      break;
    }

    result = result.slice(0, -1);
  }

  return result;
}

function extractDomainFromEmail(input: string) {
  const normalized = input.trim().toLowerCase();

  if (!SINGLE_EMAIL_REGEX.test(normalized)) {
    return null;
  }

  const [, domain] = normalized.split("@");
  return domain || null;
}

function extractDomainFromUrl(input: string) {
  const normalized = normalizeUrlValue(input);

  if (!normalized) {
    return null;
  }

  const match = normalized.match(DOMAIN_FROM_URL_REGEX);
  return match?.[1] ?? null;
}
