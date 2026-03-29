import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import styles from '../../styles/TaskForm.module.css';

const TaskForm = () => {
  const { dispatch } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: formData.title.trim(),
        description: formData.description.trim(),
        deadline: formData.deadline
      }
    });

    // إعادة تعيين النموذج
    setFormData({
      title: '',
      description: '',
      deadline: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm}>
      <div className={styles.formGroup}>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Task Title"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Task Description"
          className={styles.textarea}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className={styles.input}
        />
      </div>

      <button type="submit" className={styles.button}>Add Task</button>
    </form>
  );
};

export default TaskForm;