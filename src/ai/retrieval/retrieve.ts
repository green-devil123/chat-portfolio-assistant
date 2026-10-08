import vectorsData from '../embeddings/knowledge-vectors.ts';
import { cosineSimilarity, embedText, tokenizeText, type VectorMap } from '../embeddings/embedder.ts';
import { expandQuery } from './expand.ts';
import type { ChunkSource } from '../embeddings/corpus.ts';

export type RetrievedChunk = {
  id: string;
  source: ChunkSource;
  topic: string;
  text: string;
  score: number;
};

type StoredChunk = {
  id: string;
  source: ChunkSource;
  topic: string;
  text: string;
  vector: VectorMap;
};

type VectorsFile = {
  version: number;
  dimensions: number;
  chunks: StoredChunk[];
};

const vectors = vectorsData as unknown as VectorsFile;
const CHUNKS = vectors.chunks;

const CHUNK_WORDS = CHUNKS.map((chunk) => new Set(tokenizeText(chunk.text)));

const DOC_FREQUENCY = new Map<string, number>();
for (const words of CHUNK_WORDS) {
  for (const token of words) {
    DOC_FREQUENCY.set(token, (DOC_FREQUENCY.get(token) ?? 0) + 1);
  }
}

const KEYWORD_LENGTH = 3;
const KEYWORD_DOC_SHARE = 0.25;

function distinctiveKeywords(query: string): string[] {
  const words = new Set(tokenizeText(query));
  const limit = Math.max(1, Math.ceil(CHUNKS.length * KEYWORD_DOC_SHARE));
  const keywords: string[] = [];
  for (const word of words) {
    if (word.length < KEYWORD_LENGTH) continue;
    const df = DOC_FREQUENCY.get(word) ?? 0;
    if (df > 0 && df <= limit) keywords.push(word);
  }
  return keywords;
}

export function hasDistinctiveKeywords(query: string): boolean {
  return distinctiveKeywords(expandQuery(query)).length > 0;
}

function candidateChunks(expanded: string): StoredChunk[] {
  const keywords = distinctiveKeywords(expanded);
  if (keywords.length === 0) return CHUNKS;
  return CHUNKS.filter((_, index) => {
    const words = CHUNK_WORDS[index];
    return keywords.some((keyword) => words.has(keyword));
  });
}

export function retrieve(query: string, topK = 5, minScore = 0): RetrievedChunk[] {
  const expanded = expandQuery(query);
  const queryVector = embedText(expanded);
  if (Object.keys(queryVector).length === 0) return [];

  const results: RetrievedChunk[] = [];
  for (const chunk of candidateChunks(expanded)) {
    const score = cosineSimilarity(queryVector, chunk.vector);
    if (score >= minScore) {
      results.push({
        id: chunk.id,
        source: chunk.source,
        topic: chunk.topic,
        text: chunk.text,
        score,
      });
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

function toRetrieved(chunk: StoredChunk, score = 0): RetrievedChunk {
  return { id: chunk.id, source: chunk.source, topic: chunk.topic, text: chunk.text, score };
}

export function retrieveFamily(family: string, limit = 8): RetrievedChunk[] {
  return CHUNKS.filter((chunk) => chunk.id.startsWith(`${family}-`)).map(toRetrieved).slice(0, limit);
}