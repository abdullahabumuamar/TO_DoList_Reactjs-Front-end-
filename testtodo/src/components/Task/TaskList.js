import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { useTaskContext } from '../../context/TaskContext';
import { useTimerContext } from '../../context/TimerContext';
import styles from '../../styles/TaskList.module.css';

const TaskList = () => {
  const { state, dispatch } = useTaskContext();
  const { state: timerState } = useTimerContext();
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredTasks = () => {
    let filteredTasks = state.tasks;
    
    // تطبيق البحث أولاً
    if (searchQuery.trim()) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // ثم تطبيق الفلتر
    switch(state.filter) {
      case 'completed':
        return filteredTasks.filter(task => task.status === 'completed');
      case 'in_progress':
        return filteredTasks.filter(task => 
          task.id === timerState.activeTaskId && task.status !== 'completed'
        );
      case 'all':
      default:
        return filteredTasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const getTaskCounts = () => {
    return {
      all: state.tasks.length,
      inProgress: state.tasks.filter(task => 
        task.id === timerState.activeTaskId && task.status !== 'completed'
      ).length,
      completed: state.tasks.filter(task => task.status === 'completed').length
    };
  };

  const counts = getTaskCounts();

  return (
    <div className={styles.taskList}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="search task... "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filters}>
        <button 
          className={`${styles.filterButton} ${state.filter === 'all' ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
        >
          All Tasks ({counts.all})
        </button>
        <button 
          className={`${styles.filterButton} ${state.filter === 'in_progress' ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'in_progress' })}
        >
          In Progress ({counts.inProgress})
        </button>
        <button 
          className={`${styles.filterButton} ${state.filter === 'completed' ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
        >
          Completed ({counts.completed})
        </button>
      </div>
      
      <div className={styles.tasks}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <p className={styles.noTasks}>
            {searchQuery ? 'No results found for search' : 'No tasks found'}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskList;