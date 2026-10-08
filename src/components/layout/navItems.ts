import type { View } from '../../types';
import { ContactsIcon, EducationIcon, HomeIcon, ProjectsIcon } from './icons';

export const NAV_ITEMS: { id: View; label: string; icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'projects', label: 'Projects', icon: ProjectsIcon },
  { id: 'education', label: 'Education', icon: EducationIcon },
  { id: 'contacts', label: 'Contacts', icon: ContactsIcon },
];
