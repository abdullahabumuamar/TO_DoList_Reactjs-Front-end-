import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { useTimerContext } from '../../context/TimerContext';
import styles from '../../styles/TaskItem.module.css';

const TaskItem = ({ task }) => {
  const { dispatch: taskDispatch } = useTaskContext();
  const { dispatch: timerDispatch, state: timerState } = useTimerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    deadline: task.deadline
  });

  useEffect(() => {
    if (task.isCompleted) {
      document.title = `مهمة مكتملة: ${task.title}`;
    }
    
    return () => {
      document.title = 'To Do List';
    };
  }, [task.isCompleted, task.title]);

  const handleEdit = () => {
    taskDispatch({
      type: 'UPDATE_TASK',
      payload: {
        ...task,
        ...editData
      }
    });
    setIsEditing(false);
  };

  const toggleStatus = () => {
    if (task.status === 'completed') {
      taskDispatch({
        type: 'UPDATE_TASK',
        payload: {
          ...task,
          status: 'in_progress'
        }
      });
    } else {
      taskDispatch({
        type: 'UPDATE_TASK',
        payload: {
          ...task,
          status: 'completed'
        }
      });
      
      if (timerState.activeTaskId === task.id) {
        timerDispatch({ type: 'RESET_TIMER' });
        timerDispatch({ type: 'CLEAR_ACTIVE_TASK' });
      }
    }
  };

  const startPomodoro = () => {
    timerDispatch({
      type: 'START_TIMER',
      payload: task.id
    });
  };

  const handleDelete = () => {
    if (timerState.activeTaskId === task.id) {
      timerDispatch({ type: 'RESET_TIMER' });
    }
    taskDispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  if (isEditing) {
    return (
      <div className={styles.editing}>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          placeholder="Task Title"
          className={styles.editingInput}
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          placeholder="Task Description"
          className={styles.editingTextarea}
        />
        <input
          type="datetime-local"
          value={editData.deadline}
          onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
          className={styles.editingInput}
        />
        <div className={styles.editingButtons}>
          <button onClick={handleEdit} className={styles.saveButton}>Save Changes</button>
          <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.taskItem} ${task.status === 'completed' ? styles.completed : ''}`}>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.description}>{task.description}</p>
      {task.deadline && (
        <p className={styles.description}>Deadline: {new Date(task.deadline).toLocaleString('en-US')}</p>
      )}
      <div className={styles.controls}>
        <button onClick={toggleStatus} className={`${styles.button} ${styles.completeButton}`}>
          {task.status === 'completed' ? 'Reopen' : 'Complete'}
        </button>
        <button onClick={() => setIsEditing(true)} className={`${styles.button} ${styles.editButton}`}>Edit</button>
        <button onClick={handleDelete} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
        {task.status !== 'completed' && (
          <button 
            onClick={startPomodoro}
            disabled={timerState.isRunning && timerState.activeTaskId !== task.id}
            className={`${styles.button} ${styles.timerButton}`}
          >
            {timerState.activeTaskId === task.id ? 'Timer Active' : 'Start Timer'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem; 