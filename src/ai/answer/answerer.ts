import { hasDistinctiveKeywords, retrieve, retrieveFamily, type RetrievedChunk } from '../retrieval/retrieve.ts';

export type GroundedAnswer = {
  text: string;
  grounded: boolean;
};

export const NOT_FOUND = "I couldn't find reliable information about that in Tarun's portfolio.";

const CONFIDENCE = 0.18;
const CONFIDENCE_STRONG = 0.28;
const MAX_PARTS = 4;
const MAX_BULLETS_PER_ROLE = 2;

type Unit = {
  score: number;
  family: string;
  key: string;
  parts: string[];
};

function familyOf(id: string): string {
  return id.split('-')[0];
}

function roleIdOf(chunk: RetrievedChunk): string | null {
  const match = /^experience-(.+?)-(?:role|highlight-\d+)$/.exec(chunk.id);
  return match ? match[1] : null;
}

function cleanSegment(text: string): string {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (trimmed.length === 0) return trimmed;
  if (/[.!?…]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

function buildUnits(hits: RetrievedChunk[]): Unit[] {
  const roles = new Map<string, { score: number; header?: string; bullets: Array<{ score: number; text: string }> }>();
  const units: Unit[] = [];

  for (const hit of hits) {
    const role = roleIdOf(hit);
    if (!role) {
      units.push({ score: hit.score, family: familyOf(hit.id), key: `${hit.source}:${hit.id}`, parts: [hit.text] });
      continue;
    }
    const entry = roles.get(role) ?? { score: 0, header: undefined as string | undefined, bullets: [] };
    entry.score = Math.max(entry.score, hit.score);
    if (hit.id.endsWith('-role')) {
      entry.header = hit.text;
    } else {
      entry.bullets.push({ score: hit.score, text: hit.text.replace(/^[^:]+:\s*/, '') });
    }
    roles.set(role, entry);
  }

  for (const [role, entry] of roles) {
    entry.bullets.sort((a, b) => b.score - a.score);
    const parts: string[] = [];
    if (entry.header) parts.push(entry.header);
    for (const bullet of entry.bullets.slice(0, MAX_BULLETS_PER_ROLE)) {
      parts.push(`— ${bullet.text}`);
    }
    units.push({ score: entry.score, family: 'experience', key: role, parts });
  }

  return units.sort((a, b) => b.score - a.score);
}

export async function answerQuestion(question: string): Promise<GroundedAnswer> {
  const hits = retrieve(question, 8);
  const distinctive = hasDistinctiveKeywords(question);
  const confidence = distinctive ? CONFIDENCE : CONFIDENCE_STRONG;
  if (hits.length === 0 || hits[0].score < confidence) {
    return { text: NOT_FOUND, grounded: false };
  }

  const units = buildUnits(hits);
  const topFamily = units[0].family;
  const sameFamily = units.filter((unit) => unit.family === topFamily);
  let ordered: Unit[] = units;
  if (topFamily === 'education' || topFamily === 'profile') {
    const seenKeys = new Set(sameFamily.map((unit) => unit.key));
    const fillers = retrieveFamily(topFamily)
      .map((chunk) => ({ score: 0, family: chunk.id.split('-')[0], key: `${chunk.source}:${chunk.id}`, parts: [chunk.text] }) as Unit)
      .filter((unit) => !seenKeys.has(unit.key));
    ordered = [...sameFamily, ...fillers];
  } else if (sameFamily.length >= 2) {
    ordered = sameFamily;
  }

  const segments: string[] = [];
  const seen = new Set<string>();
  for (const unit of ordered) {
    for (const part of unit.parts) {
      if (segments.length >= MAX_PARTS) break;
      const segment = cleanSegment(part);
      if (segment.length === 0 || seen.has(segment)) continue;
      seen.add(segment);
      segments.push(segment);
    }
  }

  if (segments.length === 0) {
    return { text: NOT_FOUND, grounded: false };
  }
  return { text: segments.join('\n\n'), grounded: true };
}