import React, { useState, useEffect } from 'react';
import { TaskProvider } from './context/TaskContext';
import { TimerProvider } from './context/TimerContext';
import TaskForm from './components/Task/TaskForm';
import TaskList from './components/Task/TaskList';
import PomodoroTimer from './components/Timer/PomodoroTimer';
// استيراد جميع ملفات CSS
import styles from './styles/App.module.css';
import './styles/global.css';
import './styles/TaskForm.module.css';
import './styles/TaskList.module.css';
import './styles/TaskItem.module.css';
import './styles/PomodoroTimer.module.css';

function App() {
  //جلب السمة المحفوظة من اللوكل ستوريج إذا لم يتم العثور على أي سمة
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  //في كل مرة يتغير التيم يتم التغير اب ديت ويحفظ التيم في الولكل ستوريج
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <TaskProvider>
      <TimerProvider>
        <div className={styles.app}>
          <div className={styles.header}>
            <h1>Task Management with Pomodoro Timer</h1>
            <button 
              onClick={toggleTheme} 
              className={styles.themeToggle}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          <TaskForm />
          <div className={styles.mainContent}>
            <PomodoroTimer />
            <TaskList />
          </div>
        </div>
      </TimerProvider>
    </TaskProvider>
  );
}

export default App;