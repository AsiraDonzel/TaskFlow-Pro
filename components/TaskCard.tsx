import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import { PRIORITY_COLORS } from '../constants';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: () => void; // Prop from Column for opening the edit modal
  onDuplicate?: (task: Task) => void; // Added optional duplicate feature
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onDragStart, 
  onDelete, 
  onEdit, 
  onDuplicate 
}) => {
  return (
    <motion.div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onEdit} // Clicking the card opens the edit modal
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" } 
      }}
      whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      className="group relative glass-card p-4 rounded-xl border border-zinc-800 hover:border-indigo-500/50 transition-colors duration-300 cursor-pointer subtle-glow overflow-hidden"
    >
      {/* Animated Top Border Shimmer */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-3">
        <motion.span 
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}
        >
          {task.priority}
        </motion.span>
        
        <div className="flex items-center gap-1">
          {/* Duplicate Button */}
          {onDuplicate && (
            <motion.button 
              whileHover={{ scale: 1.2, color: '#6366f1' }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation(); // Prevents opening edit modal
                onDuplicate(task);
              }}
              className="opacity-0 group-hover:opacity-100 text-zinc-500 transition-all p-1"
              title="Duplicate task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </motion.button>
          )}

          {/* Delete Button */}
          <motion.button 
            whileHover={{ scale: 1.2, color: '#fb7185' }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation(); // Prevents opening edit modal
              onDelete(task.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-zinc-500 transition-all p-1"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </motion.button>
        </div>
      </div>

      <h4 className="text-zinc-100 font-medium mb-1 text-sm leading-snug group-hover:text-white transition-colors">
        {task.title}
      </h4>
      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
        {task.description}
      </p>
      
      <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
          {task.id.slice(0, 4).toUpperCase()}
        </span>
        <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export default TaskCard;