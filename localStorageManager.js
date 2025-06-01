export const loadTasksFromLocalStorage = () => {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    };
    
    export const saveTasksToLocalStorage = (tasks) => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    export const loadDarkModePreference = () => {
      const storedDarkMode = localStorage.getItem('darkMode');
      return storedDarkMode ? JSON.parse(storedDarkMode) : false;
    };
    
    export const saveDarkModePreference = (darkMode) => {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    };