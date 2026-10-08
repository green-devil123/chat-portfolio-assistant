import type { KnowledgeData } from '../../types/knowledge.ts';

export type ChunkSource = 'profile' | 'experience' | 'projects' | 'education' | 'skills' | 'contact';

export type ChunkDraft = {
  id: string;
  source: ChunkSource;
  topic: string;
  text: string;
};

export function buildChunks(data: KnowledgeData): ChunkDraft[] {
  const { profile, experience, projects, education, skills, contact } = data;
  const chunks: ChunkDraft[] = [];

  chunks.push({
    id: 'profile-introduction',
    source: 'profile',
    topic: 'introduction',
    text: `${profile.name} — ${profile.title} (${profile.focus}). Based in ${profile.location}. ${profile.yearsOfExperience} years of experience.`,
  });
  chunks.push({
    id: 'profile-summary',
    source: 'profile',
    topic: 'summary',
    text: profile.summary,
  });
  chunks.push({
    id: 'profile-competencies',
    source: 'profile',
    topic: 'competencies',
    text: `Core competencies: ${profile.coreCompetencies.join('; ')}.`,
  });
  chunks.push({
    id: 'profile-achievements',
    source: 'profile',
    topic: 'achievements',
    text: `Achievements: ${profile.achievements.join(' ')}`,
  });

  for (const role of experience) {
    chunks.push({
      id: `experience-${role.id}-role`,
      source: 'experience',
      topic: 'experience',
      text: `${role.title} at ${role.company}, ${role.location} (${role.period}).`,
    });
    for (let i = 0; i < role.highlights.length; i += 1) {
      chunks.push({
        id: `experience-${role.id}-highlight-${i + 1}`,
        source: 'experience',
        topic: 'experience',
        text: `${role.title} at ${role.company}: ${role.highlights[i]}`,
      });
    }
  }

  for (const project of projects) {
    const parts = [
      `${project.name} (${project.category})${project.org ? ` at ${project.org}` : ''}.`,
    ];
    if (project.role) parts.push(`Role: ${project.role}.`);
    if (project.description) parts.push(project.description);
    if (project.architecture) parts.push(`Architecture: ${project.architecture}.`);
    if (project.technologies?.length) {
      parts.push(`Technologies: ${project.technologies.join(', ')}.`);
    }
    if (project.contributions?.length) parts.push(project.contributions.join(' '));
    if (project.impact) parts.push(project.impact);
    chunks.push({
      id: `project-${project.id}`,
      source: 'projects',
      topic: 'project',
      text: parts.join(' '),
    });
  }

  for (const entry of education) {
    chunks.push({
      id: `education-${entry.id}`,
      source: 'education',
      topic: 'education',
      text: `${entry.qualification} — ${entry.institution}, ${entry.year}.`,
    });
  }

  for (const group of skills.groups) {
    chunks.push({
      id: `skills-${slug(group.name)}`,
      source: 'skills',
      topic: 'skills',
      text: `${group.name}: ${group.items.join(', ')}.`,
    });
  }

  chunks.push({
    id: 'contact',
    source: 'contact',
    topic: 'contact',
    text: `Contact: ${contact.location}. Email: ${contact.email}. Phone: ${contact.phone}. Profiles: ${contact.links.map((link) => link.label).join(', ')}.`,
  });

  return chunks;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}