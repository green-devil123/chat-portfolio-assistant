export type KnowledgeProfile = {
  name: string;
  title: string;
  focus: string;
  location: string;
  yearsOfExperience: string;
  summary: string;
  coreCompetencies: string[];
  achievements: string[];
};

export type KnowledgeExperienceRole = {
  id: string;
  company: string;
  title: string;
  location: string;
  period: string;
  start: string;
  end: string;
  highlights: string[];
};

export type KnowledgeProject = {
  id: string;
  name: string;
  category: string;
  org?: string;
  role?: string;
  description?: string;
  technologies?: string[];
  architecture?: string;
  contributions?: string[];
  impact?: string;
};

export type KnowledgeEducationEntry = {
  id: string;
  qualification: string;
  institution: string;
  year: string;
};

export type KnowledgeSkillGroup = {
  name: string;
  items: string[];
};

export type KnowledgeSkills = {
  groups: KnowledgeSkillGroup[];
};

export type KnowledgeContactLink = {
  label: string;
  url: string;
};

export type KnowledgeContact = {
  location: string;
  phone: string;
  email: string;
  links: KnowledgeContactLink[];
};

export type KnowledgeData = {
  profile: KnowledgeProfile;
  experience: KnowledgeExperienceRole[];
  projects: KnowledgeProject[];
  education: KnowledgeEducationEntry[];
  skills: KnowledgeSkills;
  contact: KnowledgeContact;
};