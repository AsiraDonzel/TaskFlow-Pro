import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Column from './components/Column';
import PortfolioCopy from './components/PortfolioCopy';
import { INITIAL_COLUMNS, INITIAL_TASKS } from './constants';
import { Task, Priority } from './types';
import { suggestTasks } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'taskflow_pro_tasks';
const HISTORY_STORAGE_KEY = 'taskflow_pro_history';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
    } catch (error) { return INITIAL_TASKS; }
  });

  // History State
  const [history, setHistory] = useState<{ id: string, title: string, action: string, time: number }[]>(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) { return []; }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium' as Priority });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [tasks, history]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addToHistory = (taskTitle: string, action: string) => {
    const entry = { id: Math.random().toString(36).substr(2, 9), title: taskTitle, action, time: Date.now() };
    setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#6366f1', '#ffffff'] };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.columnId !== columnId) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, columnId } : t));
      if (columnId === 'done') {
        triggerConfetti();
        showToast("Great job! Task completed.");
        addToHistory(task.title, "Completed");
      }
    }
  };

  const clearColumn = (columnId: string) => {
    const colTasks = tasks.filter(t => t.columnId === columnId);
    if (colTasks.length === 0) return;
    
    setTasks(prev => prev.filter(t => t.columnId !== columnId));
    addToHistory(`${colTasks.length} tasks`, `Cleared from ${columnId}`);
    showToast(`Cleared ${colTasks.length} tasks`, "info");
  };

  const openCreateModal = () => {
    setEditingTaskId(null);
    setTaskForm({ title: '', description: '', priority: 'Medium' });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskForm({ title: task.title, description: task.description, priority: task.priority });
    setIsModalOpen(true);
  };

  const saveTask = () => {
    if (!taskForm.title) return;
    if (editingTaskId) {
      setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, ...taskForm } : t));
      showToast("Task updated", "info");
    } else {
      const task: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...taskForm,
        columnId: 'todo',
        createdAt: Date.now(),
      };
      setTasks(prev => [task, ...prev]);
      showToast("New task created");
    }
    setIsModalOpen(false);
  };

  const duplicateTask = (task: Task) => {
    const clonedTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      title: `${task.title} (Copy)`,
      createdAt: Date.now()
    };
    setTasks(prev => [clonedTask, ...prev]);
    showToast("Task duplicated");
  };

  const handleAiSuggest = async () => {
    if (!taskForm.title) return;
    setIsAiLoading(true);
    const suggestions = await suggestTasks(taskForm.title);
    if (suggestions && suggestions.length > 0) {
      const newTasks: Task[] = suggestions.map((s: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: s.title,
        description: s.description,
        priority: s.priority as Priority,
        columnId: 'todo',
        createdAt: Date.now(),
      }));
      setTasks(prev => [...newTasks, ...prev]);
      showToast(`AI suggested ${suggestions.length} sub-tasks`);
    }
    setIsAiLoading(false);
    setIsModalOpen(false);
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) addToHistory(task.title, "Deleted");
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast("Task deleted", "error");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.columnId === 'todo').length,
    inProgress: tasks.filter(t => t.columnId === 'in-progress').length,
    done: tasks.filter(t => t.columnId === 'done').length,
    highPriority: tasks.filter(t => t.priority === 'High').length
  }), [tasks]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
      <header className="sticky top-0 z-50 glass-card border-b border-zinc-800 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">T</div>
          <h1 className="hidden md:block text-lg font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">TaskFlow Pro</h1>
        </div>

        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-1.5 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="View History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>
          <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span className="hidden sm:inline">Create Task</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[200] px-4 py-2 rounded-full text-xs font-medium border shadow-2xl flex items-center gap-2 ${
              notification.type === 'error' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 
              notification.type === 'info' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' :
              'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${notification.type === 'error' ? 'bg-rose-500' : notification.type === 'info' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-8 overflow-x-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Tasks', value: stats.total, color: 'text-white' },
            { label: 'To Do', value: stats.todo, color: 'text-zinc-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-indigo-400' },
            { label: 'Done', value: stats.done, color: 'text-emerald-400' },
            { label: 'High Priority', value: stats.highPriority, color: 'text-rose-400' }
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 rounded-xl border border-zinc-800/50 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6 h-full min-h-[500px]">
          {INITIAL_COLUMNS.map((col, index) => (
            <Column 
              key={col.id} 
              column={col} 
              index={index}
              tasks={filteredTasks.filter(t => t.columnId === col.id)}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDeleteTask={deleteTask}
              onEditTask={openEditModal}
              onDuplicateTask={duplicateTask}
              onClearColumn={clearColumn}
            />
          ))}
        </motion.div>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-zinc-950 border-l border-zinc-800 z-[110] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Activity Log</h2>
                <button onClick={() => setIsHistoryOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {history.length === 0 ? (
                  <p className="text-zinc-600 text-sm italic text-center pt-10">No recent activity</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          item.action.includes('Completed') ? 'bg-emerald-500/10 text-emerald-500' :
                          item.action.includes('Deleted') ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {item.action}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600">
                          {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 font-medium truncate">{item.title}</p>
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => setHistory([])}
                className="mt-6 w-full py-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors border-t border-zinc-800 pt-4"
              >
                Clear History
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PortfolioCopy />

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="glass-card w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">{editingTaskId ? 'Edit Task' : 'Create New Task'}</h3>
                  <p className="text-zinc-400 text-sm">Update details or generate sub-tasks.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1.5 block">Title</label>
                  <input autoFocus className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" value={taskForm.title} onChange={e => setTaskForm(prev => ({ ...prev, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1.5 block">Description</label>
                  <textarea className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-24 resize-none" value={taskForm.description} onChange={e => setTaskForm(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1.5 block">Priority</label>
                  <div className="flex gap-2">
                    {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
                      <button key={p} onClick={() => setTaskForm(prev => ({ ...prev, priority: p }))} className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${taskForm.priority === p ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-zinc-900/50 flex flex-col gap-3">
                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition-colors">Cancel</button>
                  <button onClick={saveTask} disabled={!taskForm.title} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">{editingTaskId ? 'Save Changes' : 'Create Task'}</button>
                </div>
                {!editingTaskId && (
                  <button onClick={handleAiSuggest} disabled={!taskForm.title || isAiLoading} className="w-full bg-zinc-100 hover:bg-white text-black px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                    {isAiLoading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Generate Sub-tasks with AI"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;