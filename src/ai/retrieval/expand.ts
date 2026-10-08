const PHRASE_EXPANSIONS: Record<string, string> = {
  'tell me about yourself': 'introduction summary career experience',
  'about yourself': 'introduction summary',
  'about you': 'introduction summary',
  'who are you': 'introduction summary',
  'who is tarun': 'introduction summary tarun',
  'what can you do': 'introduction capabilities',
  'hire me': 'contact email phone',
};

const EDUCATION_FAMILY = 'education qualification institutions technology engineering electronics';

const TOKEN_EXPANSIONS: Record<string, string> = {
  self: 'introduction summary career',
  yourself: 'introduction summary career',
  study: EDUCATION_FAMILY,
  college: EDUCATION_FAMILY,
  school: EDUCATION_FAMILY,
  university: EDUCATION_FAMILY,
  education: EDUCATION_FAMILY,
  degree: EDUCATION_FAMILY,
  graduated: EDUCATION_FAMILY,
  qualification: EDUCATION_FAMILY,
  email: 'contact mail',
  mail: 'contact email',
  phone: 'contact call number',
  number: 'contact phone',
  reach: 'contact email phone location',
  contact: 'contact location email phone links profiles',
  resume: 'profile summary skills experience',
  cv: 'profile summary skills experience',
  stack: 'technologies frameworks skills',
  techstack: 'technologies frameworks tools',
  tech: 'technologies tools skills',
  technologies: 'tech tools skills stack',
  framework: 'frameworks libraries stack technologies',
  frameworks: 'frameworks libraries stack technologies',
  project: 'projects work built',
  projects: 'projects work built',
  genai: 'generative ai llm rag',
  llm: 'language model rag generative',
  rag: 'retrieval augmented generation knowledge assistant',
  ml: 'machine learning ai',
  ai: 'artificial intelligence',
  achievement: 'achievements',
  certification: 'achievements certifications',
  certifications: 'achievements certifications',
  achievements: 'achievements',
  location: 'bengaluru location india',
  address: 'contact location bengaluru',
  hire: 'contact email phone',
};

export function expandQuery(query: string): string {
  const normalized = query.toLowerCase().trim();

  if (PHRASE_EXPANSIONS[normalized]) {
    return `${query} ${PHRASE_EXPANSIONS[normalized]}`;
  }

  const extras = new Set<string>();
  for (const token of normalized.split(/[^a-z0-9]+/).filter(Boolean)) {
    const expanded = TOKEN_EXPANSIONS[token];
    if (expanded) {
      for (const word of expanded.split(' ')) {
        if (word) extras.add(word);
      }
    }
  }
  if (extras.size === 0) return query;
  return `${query} ${[...extras].join(' ')}`;
}