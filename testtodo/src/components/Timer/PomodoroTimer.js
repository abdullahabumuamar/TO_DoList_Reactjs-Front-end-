import React, { Component } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { TaskContext } from '../../context/TaskContext';
import styles from '../../styles/PomodoroTimer.module.css';

class PomodoroTimer extends Component {
  static contextType = TimerContext;

  constructor(props) {
    super(props);
    this.interval = null;
  }

  componentDidMount() {
    // لا نبدأ المؤقت تلقائياً عند تحميل المكون
  }

  componentDidUpdate(prevProps, prevState) {
    const { state: timerState } = this.context;
    
    // نتحقق من تغيير حالة المؤقت
    if (timerState.isRunning !== prevProps?.isRunning) {
      if (timerState.isRunning) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    }

    // نتحقق من انتهاء الوقت
    if (timerState.timeLeft === 0 && prevProps?.timeLeft > 0) {
      this.handleTimerComplete();
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer = () => {
    const { dispatch } = this.context;
    // نتأكد من إيقاف أي مؤقت سابق قبل بدء مؤقت جديد
    this.stopTimer();
    
    this.interval = setInterval(() => {
      const { state } = this.context;
      if (state.timeLeft > 0 && state.isRunning) {
        dispatch({ type: 'TICK' });
      } else if (state.timeLeft === 0) {
        this.handleTimerComplete();
      }
    }, 1000);
  }

  stopTimer = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  handleTimerComplete = () => {
    const { dispatch } = this.context;
    this.stopTimer();
    dispatch({ type: 'SWITCH_MODE' });
  }

  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  render() {
    return (
      <TimerContext.Consumer>
        {({ state: timerState, dispatch: timerDispatch }) => (
          <TaskContext.Consumer>
            {({ state: taskState }) => {
              const activeTask = taskState.tasks.find(task => task.id === timerState.activeTaskId);

              return (
                <div className={styles.pomodoroTimer}>
                  <h2>Pomodoro Timer</h2>
                  <div className={styles.timerDisplay}>
                    <p>Mode: {timerState.mode === 'work' ? 'Work' : 'Break'}</p>
                    <h3>{this.formatTime(timerState.timeLeft)}</h3>
                    {activeTask && <p>Current Task: {activeTask.title}</p>}
                  </div>
                  <div className={styles.timerControls}>
                    <button
                      onClick={() => timerDispatch({ 
                        type: timerState.isRunning ? 'PAUSE_TIMER' : 'START_TIMER',
                        payload: timerState.activeTaskId 
                      })}
                      className={styles.button}
                    >
                      {timerState.isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button 
                      onClick={() => {
                        timerDispatch({ type: 'RESET_TIMER' });
                        this.stopTimer();
                      }}
                      className={styles.button}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              );
            }}
          </TaskContext.Consumer>
        )}
      </TimerContext.Consumer>
    );
  }
}

export default PomodoroTimer; 