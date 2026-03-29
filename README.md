# Task Management with Pomodoro Timer

A simple React app to manage daily tasks and focus sessions using a built-in Pomodoro timer.

## Features

- Create tasks with title, description, and optional deadline
- Edit, complete/reopen, and delete tasks
- Search tasks by title
- Filter tasks by `All`, `In Progress`, and `Completed`
- Start a Pomodoro timer for a selected task
- Automatically switch between work and break modes
- Save tasks, theme, and timer durations in `localStorage`
- Toggle between light and dark theme

## Tech Stack

- React (Create React App)
- Context API + `useReducer` for state management
- CSS Modules for component styling

## Run Locally

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser.