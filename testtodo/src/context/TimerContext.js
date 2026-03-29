import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';

// تصدير السياق مباشرة
export const TimerContext = createContext();

const initialState = {
  isRunning: false,
  mode: 'work', // 'work' or 'break'
  timeLeft: parseInt(localStorage.getItem('workDuration')) || 25 * 60, // 25 minutes in seconds
  activeTaskId: null,
  workDuration: parseInt(localStorage.getItem('workDuration')) || 25 * 60,
  breakDuration: parseInt(localStorage.getItem('breakDuration')) || 5 * 60
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        activeTaskId: action.payload
      };
      
    case 'PAUSE_TIMER':
      return {
        ...state,
        isRunning: false
      };
      
    case 'RESET_TIMER':
      return {
        ...state,
        isRunning: false,
        timeLeft: state.mode === 'work' ? state.workDuration : state.breakDuration
      };
      
    case 'SWITCH_MODE':
      return {
        ...state,
        mode: state.mode === 'work' ? 'break' : 'work',
        timeLeft: state.mode === 'work' ? state.breakDuration : state.workDuration,
        isRunning: false
      };
      
    case 'TICK':
      if (state.timeLeft <= 1) {
        new Notification('Timer Finished!', {
          body: `${state.mode === 'work' ? 'Work' : 'Break'} session completed!`
        });
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1
      };

    case 'UPDATE_SETTINGS':
      localStorage.setItem('workDuration', action.payload.workDuration);
      localStorage.setItem('breakDuration', action.payload.breakDuration);
      return {
        ...state,
        workDuration: action.payload.workDuration,
        breakDuration: action.payload.breakDuration,
        timeLeft: state.mode === 'work' ? action.payload.workDuration : action.payload.breakDuration
      };

    case 'CLEAR_ACTIVE_TASK':
      return {
        ...state,
        activeTaskId: null,
        isRunning: false,
        timeLeft: state.workDuration
      };

    default:
      return state;
  }
};

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    // تنظيف المؤقت عند إلغاء تحميل المكون
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => useContext(TimerContext); 