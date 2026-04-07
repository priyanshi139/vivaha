import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

const SortableTask: React.FC<{ task: Task; toggleTask: (id: string) => void }> = ({ task, toggleTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
        task.completed ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300">
        <GripVertical size={20} />
      </div>
      <motion.div
        onClick={() => toggleTask(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
          task.completed ? 'bg-emerald-500 border-emerald-500 text-ivory' : 'border-slate-200'
        }`}
        whileTap={{ scale: 0.8 }}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <CheckCircle2 size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <span
        onClick={() => toggleTask(task.id)}
        className={`font-medium flex-1 cursor-pointer ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
      >
        {task.title}
      </span>
    </div>
  );
};

export default SortableTask;
