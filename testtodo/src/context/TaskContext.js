import React, { createContext, useContext, useReducer, useEffect } from 'react';

// تصدير السياق مباشرة
export const TaskContext = createContext();

// تحميل المهام  localStorage
const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  filter: 'all'
};

const taskReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_TASK':
        const newTasks = {
          ...state,
          tasks: [...state.tasks, {
            id: Date.now(),
            title: action.payload.title,
            description: action.payload.description,
            status: 'in_progress',
            deadline: action.payload.deadline,
            isTimerActive: false
          }]
        };
        // حفظ المهام في localStorage
        localStorage.setItem('tasks', JSON.stringify(newTasks.tasks));
        return newTasks;
        
      case 'UPDATE_TASK':
        const updatedTasks = {
          ...state,
          tasks: state.tasks.map(task =>
            task.id === action.payload.id ? { ...task, ...action.payload } : task
          )
        };
        // حفظ المهام المحدثة في localStorage
        localStorage.setItem('tasks', JSON.stringify(updatedTasks.tasks));
        return updatedTasks;
        
      case 'DELETE_TASK':
        const remainingTasks = {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload)
        };
        // حفظ المهام المتبقية في localStorage
        localStorage.setItem('tasks', JSON.stringify(remainingTasks.tasks));
        return remainingTasks;
        
      case 'SET_FILTER':
        return {
          ...state,
          filter: action.payload
        };
        
      default:
        return state;
    }
  };

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // تحميل المهام من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      dispatch({
        type: 'LOAD_TASKS',
        payload: JSON.parse(savedTasks)
      });
    }
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext); 