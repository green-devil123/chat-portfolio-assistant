/// <reference types="node" />

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIMENSIONS, embedText } from '../src/ai/embeddings/embedder.ts';
import { buildChunks } from '../src/ai/embeddings/corpus.ts';
import type { KnowledgeData } from '../src/types/knowledge.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KNOWLEDGE_DIR = join(ROOT, 'src', 'knowledge');
const OUTPUT_FILE = join(ROOT, 'src', 'ai', 'embeddings', 'knowledge-vectors.ts');

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(join(KNOWLEDGE_DIR, file), 'utf8')) as unknown;
}

const knowledge: KnowledgeData = {
  profile: readJson('profile.json') as KnowledgeData['profile'],
  experience: readJson('experience.json') as KnowledgeData['experience'],
  projects: readJson('projects.json') as KnowledgeData['projects'],
  education: readJson('education.json') as KnowledgeData['education'],
  skills: readJson('skills.json') as KnowledgeData['skills'],
  contact: readJson('contact.json') as KnowledgeData['contact'],
};

const chunks = buildChunks(knowledge).map((chunk) => {
  const vector: Record<number, number> = {};
  for (const [index, weight] of Object.entries(embedText(chunk.text))) {
    vector[Number(index)] = Number(weight.toFixed(6));
  }
  return {
    id: chunk.id,
    source: chunk.source,
    topic: chunk.topic,
    text: chunk.text,
    vector,
  };
});

const output = {
  version: 1,
  dimensions: DIMENSIONS,
  generatedAt: new Date().toISOString(),
  chunks,
};

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, `export default ${JSON.stringify(output)};\n`);
console.log(`Wrote ${chunks.length} embeddings to ${OUTPUT_FILE}`);