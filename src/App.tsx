import { useState } from 'react';
import { BootSequence } from './components/boot/BootSequence';
import { ChatInput } from './components/chat/ChatInput';
import { ChatWindow } from './components/chat/ChatWindow';
import { DEFAULT_SUGGESTIONS } from './components/home/defaultSuggestions';
import { Welcome } from './components/home/Welcome';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { RightPanel } from './components/layout/RightPanel';
import { ContactsView } from './components/views/ContactsView';
import { EducationView } from './components/views/EducationView';
import { ProjectsView } from './components/views/ProjectsView';
import { SkillsView } from './components/views/SkillsView';
import { useChat } from './hooks/useChat';
import { useNavigation } from './hooks/useNavigation';

export default function App() {
  const { view, navigate } = useNavigation();
  const chat = useChat();
  const [booting, setBooting] = useState(true);

  return (
    <div className="crt h-full bg-ink text-ivory">
      {booting && <BootSequence onDone={() => setBooting(false)} />}

      <MobileNavigation activeView={view} onNavigate={navigate} />

      <div className="flex h-full pt-14 lg:pt-0">
        <LeftSidebar activeView={view} onNavigate={navigate} />

        <RightPanel view={view}>
          <div key={view} className="panel-enter flex min-h-0 flex-1 flex-col">
            {view === 'home' ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  {chat.hasStarted ? (
                    <ChatWindow messages={chat.messages} isAnswering={chat.isAnswering} />
                  ) : (
                    <Welcome suggestions={DEFAULT_SUGGESTIONS} onSelectSuggestion={chat.sendMessage} />
                  )}
                </div>

                <ChatInput
                  onSubmit={chat.sendMessage}
                  placeholder={
                    chat.hasStarted ? 'ENTER QUERY...' : 'ENTER QUERY ABOUT TARUN...'
                  }
                />
              </div>
            ) : view === 'projects' ? (
              <ProjectsView />
            ) : view === 'education' ? (
              <EducationView />
            ) : view === 'skills' ? (
              <SkillsView />
            ) : (
              <ContactsView />
            )}
          </div>
        </RightPanel>
      </div>
    </div>
  );
}
