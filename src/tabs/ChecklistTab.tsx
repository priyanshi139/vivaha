import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, Send } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GoogleGenAI } from '@google/genai';
import { useApp } from '../context/AppContext';
import SortableTask from '../components/SortableTask';
import { Task } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ChecklistTab: React.FC = () => {
  const { tasks, setTasks, state, isAddTaskOpen, setIsAddTaskOpen, newTaskTitle, setNewTaskTitle } = useApp();
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiInput, setAiInput] = useState('');

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = { id: Math.random().toString(36).substring(2, 9), title: newTaskTitle, completed: false };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsAddTaskOpen(false);
  };

  const askAi = async (customPrompt?: string) => {
    setLoadingAi(true); setAiChatOpen(true);
    const prompt = customPrompt || 'Generate a personalized wedding planning timeline and checklist for an Indian wedding in Udaipur for 500 guests with a budget of 50 lakhs. Format as a concise list of priority tasks.';
    try {
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiResponse(response.text || 'No response');
    } catch { setAiResponse('Error connecting to AI assistant.'); }
    setLoadingAi(false);
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-rose">Wedding Checklist</h2>
        <button onClick={() => setIsAddTaskOpen(true)} className="bg-rose text-ivory p-3 rounded-2xl shadow-lg"><Plus size={20} /></button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">{tasks.map(task => <SortableTask key={task.id} task={task} toggleTask={toggleTask} />)}</div>
        </SortableContext>
      </DndContext>

      <button
        onClick={state.isPremium ? askAi : () => alert('Upgrade to Premium for AI assistance!')}
        className="absolute bottom-36 right-4 w-16 h-16 bg-gradient-to-br from-rose to-petal rounded-full shadow-2xl flex items-center justify-center text-gold border-2 border-gold/20 z-50 animate-bounce"
      >
        <Sparkles size={28} />
      </button>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddTaskOpen && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div key="modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-ivory w-full max-w-sm rounded-[2rem] p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-rose mb-6">Add New Task</h3>
              <input autoFocus type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddTask()} placeholder="What needs to be done?" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold mb-6" />
              <div className="flex gap-4">
                <button onClick={() => setIsAddTaskOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400">Cancel</button>
                <button onClick={handleAddTask} className="flex-1 bg-rose text-ivory py-4 rounded-2xl font-bold shadow-lg shadow-rose/20">Add Task</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Modal */}
      <AnimatePresence>
        {aiChatOpen && (
          <motion.div key="ai-modal" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end">
            <div className="bg-ivory w-full rounded-t-[3rem] p-8 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center text-gold"><Sparkles size={24} /></div>
                  <div><h3 className="text-xl font-bold text-rose">AI Concierge</h3><p className="text-xs text-slate-500">Premium Planning Assistant</p></div>
                </div>
                <button onClick={() => setAiChatOpen(false)} className="text-slate-400"><Plus className="rotate-45" size={24} /></button>
              </div>
              {loadingAi ? (
                <div className="py-12 flex flex-col items-center gap-4"><div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" /><p className="text-slate-500 italic">Consulting with wedding experts...</p></div>
              ) : (
                <div className="space-y-6">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">{aiResponse || "Hello! I'm your AI Wedding Planner. How can I help you today?"}</div>
                  <div className="relative">
                    <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyPress={e => { if (e.key === 'Enter' && aiInput.trim()) { askAi(aiInput); setAiInput(''); } }} placeholder="Ask me anything about your wedding..." className="w-full p-5 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold shadow-sm pr-16" />
                    <button onClick={() => { if (aiInput.trim()) { askAi(aiInput); setAiInput(''); } }} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-rose text-ivory rounded-xl flex items-center justify-center"><Send size={20} /></button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {['Suggest Udaipur venues', 'Wedding budget tips', 'Traditional rituals list', 'Vendor selection guide'].map(s => (
                      <button key={s} onClick={() => askAi(s)} className="px-4 py-2 bg-gold/10 text-rose border border-gold/20 rounded-full text-[10px] font-bold whitespace-nowrap">{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChecklistTab;
