export type View = 'home' | 'projects' | 'education' | 'contacts';

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
