export type View = 'home' | 'projects' | 'education' | 'skills' | 'contacts';

export type Role = 'user' | 'assistant';

export type Message = {
  id: string;
  role: Role;
  content: string;
};

export type ChatState = {
  hasStarted: boolean;
  messages: Message[];
};
