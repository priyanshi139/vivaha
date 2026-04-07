import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Task } from '../types';
import { INITIAL_TASKS } from '../constants';

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTab: 'home' | 'checklist' | 'inspiration' | 'packages' | 'profile' | 'budget';
  setActiveTab: React.Dispatch<React.SetStateAction<AppContextType['activeTab']>>;
  sideMenuOpen: boolean;
  setSideMenuOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  megaMenuOpen: boolean;
  setMegaMenuOpen: (v: boolean) => void;
  isLoading: boolean;
  isExpertChatOpen: boolean;
  setIsExpertChatOpen: (v: boolean) => void;
  showSplash: boolean;
  setShowSplash: (v: boolean) => void;
  selectedVendor: any;
  setSelectedVendor: (v: any) => void;
  selectedBoard: any;
  setSelectedBoard: (v: any) => void;
  isAddTaskOpen: boolean;
  setIsAddTaskOpen: (v: boolean) => void;
  newTaskTitle: string;
  setNewTaskTitle: (v: string) => void;
  navigate: (screen: AppState['screen']) => void;
}

const AppContext = createContext<AppContextType>(null!);
export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    screen: 'splash',
    userType: null,
    userDetails: null,
    fianceDetails: null,
    weddingDetails: null,
    isPremium: false,
    guests: [],
  });
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<AppContextType['activeTab']>('home');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpertChatOpen, setIsExpertChatOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Loading skeleton timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Persistence — load on mount
  useEffect(() => {
    let id = localStorage.getItem('vivaha_user_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('vivaha_user_id', id);
    }
    fetch(`/api/state/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setState(data.state);
          setTasks(data.tasks || INITIAL_TASKS);
        }
      })
      .catch(console.error);
  }, []);

  // Persistence — save on change
  useEffect(() => {
    const id = localStorage.getItem('vivaha_user_id');
    if (id && state.screen !== 'splash') {
      fetch(`/api/state/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, tasks }),
      }).catch(console.error);
    }
  }, [state, tasks]);

  const navigate = (screen: AppState['screen']) =>
    setState(prev => ({ ...prev, screen }));

  return (
    <AppContext.Provider
      value={{
        state, setState, tasks, setTasks,
        activeTab, setActiveTab,
        sideMenuOpen, setSideMenuOpen,
        notificationsOpen, setNotificationsOpen,
        megaMenuOpen, setMegaMenuOpen,
        isLoading,
        isExpertChatOpen, setIsExpertChatOpen,
        showSplash, setShowSplash,
        selectedVendor, setSelectedVendor,
        selectedBoard, setSelectedBoard,
        isAddTaskOpen, setIsAddTaskOpen,
        newTaskTitle, setNewTaskTitle,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
