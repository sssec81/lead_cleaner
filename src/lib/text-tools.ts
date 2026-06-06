import { parsePhoneNumberFromString } from "libphonenumber-js";

const EMAIL_REGEX = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
const SINGLE_EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const PHONE_REGEX = /(?:\+?\d[\d().\-\s]{6,}\d)/g;
const URL_REGEX =
  /\b(?:https?:\/\/|www\.)[^\s<>"'()]+(?:\([^\s<>"']*\)|[^\s<>"'.,;:!?])/gi;
const DOMAIN_FROM_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?([^\/?#:]+)(?::\d+)?(?:[\/?#]|$)/i;

export type CleaningStats = {
  scanned: number;
  found: number;
  valid: number;
  duplicatesRemoved: number;
  invalidRemoved: number;
  blankRemoved?: number;
  finalCount: number;
};

export function parseAndFormatPhone(value: string): string | null {
  const candidate = value.trim();
  if (!candidate) return null;

  if (candidate.startsWith("+")) {
    const parsed = parsePhoneNumberFromString(candidate);
    if (parsed && parsed.isValid()) {
      return parsed.format("E.164");
    }
  } else {
    let parsed = parsePhoneNumberFromString(candidate, "US");
    if (parsed && parsed.isValid()) {
      return parsed.format("E.164");
    }
    parsed = parsePhoneNumberFromString(candidate, "GB");
    if (parsed && parsed.isValid()) {
      return parsed.format("E.164");
    }
  }

  // Fallback: Retain numbers that look like valid international/local numbers (7-15 digits)
  // even if they don't strictly pass US/GB validation to avoid aggressively deleting leads.
  const digitsOnly = candidate.replace(/[^\d+]/g, "");
  const pureDigitsCount = digitsOnly.replace("+", "").length;
  
  if (pureDigitsCount >= 7 && pureDigitsCount <= 15) {
    return digitsOnly;
  }

  return null;
}

export function extractEmailsFromText(input: string) {
  const lines = input.split(/\r?\n/);
  const blankRemoved = lines.filter((line) => !line.trim()).length;
  
  const matches = input.match(EMAIL_REGEX) ?? [];
  const validEmails = matches.filter((entry) => SINGLE_EMAIL_REGEX.test(entry.trim()));
  const invalidRemoved = matches.length - validEmails.length;

  const cleaned = validEmails.map((entry) => entry.trim().toLowerCase());
  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: CleaningStats = {
    scanned: lines.length,
    found: matches.length,
    valid: validEmails.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved,
    blankRemoved,
    finalCount: deduped.length,
  };

  return { results: deduped, stats };
}

export function cleanEmailList(input: string) {
  const items = input.split(/[\n\r,\t; ]+/).map((entry) => entry.trim());
  const blankRemoved = items.filter((entry) => entry === "").length;
  const candidates = items.filter((entry) => entry !== "");

  const validEmails = candidates.filter((entry) => SINGLE_EMAIL_REGEX.test(entry));
  const invalidRemoved = candidates.length - validEmails.length;

  const cleaned = validEmails.map((entry) => entry.toLowerCase());
  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: CleaningStats = {
    scanned: items.length,
    found: candidates.length,
    valid: validEmails.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved,
    blankRemoved,
    finalCount: deduped.length,
  };

  return { results: deduped, stats };
}

export function removeDuplicateEmails(input: string) {
  return cleanEmailList(input);
}

export function validateEmailListSyntax(input: string) {
  const items = input.split(/[\n\r,\t; ]+/).map((entry) => entry.trim());
  const blankRemoved = items.filter((entry) => entry === "").length;
  const candidates = items.filter((entry) => entry !== "");

  const validEmails: string[] = [];
  const invalidEmails: string[] = [];

  candidates.forEach((entry) => {
    if (SINGLE_EMAIL_REGEX.test(entry)) {
      validEmails.push(entry.toLowerCase());
    } else {
      invalidEmails.push(entry);
    }
  });

  const dedupedValid = Array.from(new Set(validEmails)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: CleaningStats = {
    scanned: items.length,
    found: candidates.length,
    valid: validEmails.length,
    duplicatesRemoved: validEmails.length - dedupedValid.length,
    invalidRemoved: invalidEmails.length,
    blankRemoved,
    finalCount: dedupedValid.length,
  };

  return { results: dedupedValid, invalidResults: invalidEmails, stats };
}

export function extractPhoneNumbersFromText(input: string) {
  const lines = input.split(/\r?\n/);
  const blankRemoved = lines.filter((line) => !line.trim()).length;

  const matches = input.match(PHONE_REGEX) ?? [];
  const cleaned: string[] = [];
  let invalidRemoved = 0;

  matches.forEach((entry) => {
    const normalized = parseAndFormatPhone(entry);
    if (normalized) {
      cleaned.push(normalized);
    } else {
      invalidRemoved += 1;
    }
  });

  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: CleaningStats = {
    scanned: lines.length,
    found: matches.length,
    valid: cleaned.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved,
    blankRemoved,
    finalCount: deduped.length,
  };

  return { results: deduped, stats };
}

export function removeDuplicatePhoneNumbers(input: string) {
  return extractPhoneNumbersFromText(input);
}

export function extractUrlsFromText(input: string) {
  const lines = input.split(/\r?\n/);
  const blankRemoved = lines.filter((line) => !line.trim()).length;

  const matches = input.match(URL_REGEX) ?? [];
  const cleaned: string[] = [];
  let invalidRemoved = 0;

  matches.forEach((entry) => {
    const normalized = normalizeUrlValue(entry);
    if (normalized) {
      cleaned.push(normalized);
    } else {
      invalidRemoved += 1;
    }
  });

  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: CleaningStats = {
    scanned: lines.length,
    found: matches.length,
    valid: cleaned.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved,
    blankRemoved,
    finalCount: deduped.length,
  };

  return { results: deduped, stats };
}

export function extractDomainsFromEmails(input: string) {
  const lines = input.split(/\r?\n/);
  const blankRemoved = lines.filter((line) => !line.trim()).length;

  const emailMatches = input.match(EMAIL_REGEX) ?? [];
  const urlMatches = input.match(URL_REGEX) ?? [];
  const found = emailMatches.length + urlMatches.length;

  const cleaned: string[] = [];
  let invalidRemoved = 0;

  emailMatches.forEach((entry) => {
    const domain = extractDomainFromEmail(entry);
    if (domain) {
      cleaned.push(domain);
    } else {
      invalidRemoved += 1;
    }
  });

  urlMatches.forEach((entry) => {
    const domain = extractDomainFromUrl(entry);
    if (domain) {
      cleaned.push(domain);
    } else {
      invalidRemoved += 1;
    }
  });

  const deduped = Array.from(new Set(cleaned)).sort((a, b) =>
    a.localeCompare(b),
  );

  const stats: CleaningStats = {
    scanned: lines.length,
    found,
    valid: cleaned.length,
    duplicatesRemoved: cleaned.length - deduped.length,
    invalidRemoved,
    blankRemoved,
    finalCount: deduped.length,
  };

  return { results: deduped, stats };
}

export function normalizeUrlValue(input: string) {
  const trimmed = stripTrailingUrlPunctuation(input.trim());

  if (!trimmed) {
    return null;
  }

  const lowerTrimmed = trimmed.toLowerCase();
  const withProtocol = lowerTrimmed.startsWith("www.")
    ? `https://${lowerTrimmed.slice(4)}`
    : lowerTrimmed;

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
