export type VectorMap = Record<number, number>;

export const DIMENSIONS = 1024;

const STOPWORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'being', 'by', 'can', 'could',
  'do', 'does', 'for', 'from', 'has', 'had', 'have', 'he', 'her', 'his', 'i', 'if', 'in',
  'into', 'is', 'it', 'its', 'me', 'my', 'no', 'not', 'of', 'on', 'or', 'our', 'ours', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then', 'there',
  'these', 'they', 'this', 'those', 'to', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'yours',
]);

function hashString(feature: string): number {
  let hash = 5381;
  for (let i = 0; i < feature.length; i += 1) {
    hash = ((hash << 5) + hash + feature.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function tokenizeText(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^a-z0-9]+/g, ' ');
  return cleaned
    .split(' ')
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

export function embedText(text: string): VectorMap {
  const words = tokenizeText(text);
  if (words.length === 0) return {};

  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  const accum = new Map<number, number>();
  const add = (feature: string, weight: number) => {
    const index = hashString(feature) % DIMENSIONS;
    accum.set(index, (accum.get(index) ?? 0) + weight);
  };

  for (const [word, count] of counts) {
    const tf = 1 + Math.log(count);
    add(`u:${word}`, tf);
    const padded = `__${word}__`;
    for (let i = 0; i <= padded.length - 3; i += 1) {
      add(`c:${padded.slice(i, i + 3)}`, 0.3 * tf);
    }
  }

  for (let i = 0; i < words.length - 1; i += 1) {
    add(`b:${words[i]}|${words[i + 1]}`, 0.5);
  }

  const magnitude = Math.sqrt(
    [...accum.values()].reduce((sum, value) => sum + value * value, 0),
  );
  if (magnitude === 0) return {};

  const vector: VectorMap = {};
  for (const [index, value] of accum) {
    vector[index] = value / magnitude;
  }
  return vector;
}

export function cosineSimilarity(query: VectorMap, target: VectorMap): number {
  const keys = Object.keys(query);
  if (keys.length === 0) return 0;
  let dot = 0;
  for (const key of keys) {
    const targetWeight = target[Number(key)];
    if (targetWeight !== undefined) {
      dot += query[Number(key)] * targetWeight;
    }
  }
  return dot;
}