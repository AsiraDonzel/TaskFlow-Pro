import React, { useState } from 'react'; // Added useState
import { motion, AnimatePresence } from 'framer-motion';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  index: number;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onClearColumn: (columnId: string) => void; // New prop
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  index, 
  onDragStart, 
  onDrop, 
  onDeleteTask,
  onEditTask,
  onDuplicateTask,
  onClearColumn
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu toggle state

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col w-80 shrink-0 h-full rounded-2xl bg-zinc-950/20 border border-zinc-800/40 p-3"
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="flex items-center justify-between mb-4 px-2 relative">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          {column.title}
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            key={tasks.length}
            className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-md min-w-[1.2rem] text-center"
          >
            {tasks.length}
          </motion.span>
        </h3>

        {/* Updated Action Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`transition-colors p-1 rounded-md ${isMenuOpen ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-8 w-40 glass-card border border-zinc-800 rounded-lg shadow-2xl z-20 py-1 overflow-hidden"
              >
                <button 
                  onClick={() => { onClearColumn(column.id); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-[11px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  Clear Column
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 min-h-[150px]">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ 
                layout: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <TaskCard 
                task={task} 
                onDragStart={onDragStart} 
                onDelete={onDeleteTask}
                onEdit={() => onEditTask(task)}
                onDuplicate={onDuplicateTask}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-24 border-2 border-dashed border-zinc-800/50 rounded-xl flex items-center justify-center text-zinc-600 text-xs"
          >
            Drop tasks here
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Column;