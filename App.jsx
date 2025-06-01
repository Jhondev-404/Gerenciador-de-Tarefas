import React, { useState, useEffect } from 'react';
    import { Moon, Sun, PlusCircle } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Toaster } from '@/components/ui/toaster';
    import { useToast } from '@/components/ui/use-toast';
    import TaskList from '@/components/TaskList';
    import TaskFormModal from '@/components/TaskFormModal';
    import TaskFilterTabs from '@/components/TaskFilterTabs';
    import { loadTasksFromLocalStorage, saveTasksToLocalStorage, loadDarkModePreference, saveDarkModePreference } from '@/lib/localStorageManager';

    const App = () => {
      const [tasks, setTasks] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingTask, setEditingTask] = useState(null);
      const [darkMode, setDarkMode] = useState(false);
      const [filter, setFilter] = useState('all');
      const { toast } = useToast();

      useEffect(() => {
        setTasks(loadTasksFromLocalStorage());
        setDarkMode(loadDarkModePreference());
      }, []);

      useEffect(() => {
        saveTasksToLocalStorage(tasks);
      }, [tasks]);

      useEffect(() => {
        saveDarkModePreference(darkMode);
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [darkMode]);

      const openAddTaskModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
      };

      const openEditTaskModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
      };

      const handleSaveTask = (taskData) => {
        if (editingTask) {
          setTasks(tasks.map(task => (task.id === editingTask.id ? { ...editingTask, ...taskData } : task)));
          toast({ title: 'Sucesso!', description: 'Tarefa atualizada com sucesso.', duration: 3000 });
        } else {
          setTasks([...tasks, { ...taskData, id: Date.now(), completed: false }]);
          toast({ title: 'Sucesso!', description: 'Tarefa adicionada com sucesso.', duration: 3000 });
        }
        setIsModalOpen(false);
        setEditingTask(null);
      };

      const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
        toast({
          title: 'Sucesso!',
          description: 'Tarefa excluída com sucesso.',
          variant: 'destructive',
          duration: 3000,
        });
      };

      const toggleCompleteTask = (id) => {
        setTasks(
          tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      };

      const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
      });

      return (
        <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-slate-800' : 'bg-gradient-to-br from-sky-100 to-cyan-200'} text-foreground transition-colors duration-500 p-4 sm:p-8`}>
          <div className="container mx-auto max-w-3xl">
            <header className="flex justify-between items-center py-6 mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400"
              >
                Lista de Tarefas
              </motion.h1>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
                >
                  {darkMode ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-indigo-600" />}
                </Button>
                <Button onClick={openAddTaskModal} className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg">
                  <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Tarefa
                </Button>
              </div>
            </header>

            <TaskFilterTabs filter={filter} onFilterChange={setFilter} />

            <TaskList
              tasks={filteredTasks}
              filter={filter}
              onToggleComplete={toggleCompleteTask}
              onEdit={openEditTaskModal}
              onDelete={handleDeleteTask}
            />
          </div>

          <TaskFormModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            onSave={handleSaveTask}
            taskToEdit={editingTask}
          />

          <Toaster />
          <footer className="text-center mt-12 py-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Criado por Jhonatan.© {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      );
    };

    export default App;