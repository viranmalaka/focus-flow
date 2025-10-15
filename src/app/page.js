"use client";
import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";
import { AnalysisPage } from "./components/AnalysisPage";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const localData = localStorage.getItem("focusFlowTasks");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error parsing tasks from localStorage", error);
      return [];
    }
  });

  const [allTags, setAllTags] = useState(() => {
    try {
      const localData = localStorage.getItem("focusFlowTags");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error parsing tags from localStorage", error);
      return [];
    }
  });

  const [currentView, setCurrentView] = useState("tasks"); // 'tasks' or 'analysis'
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("focusFlowTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("focusFlowTags", JSON.stringify(allTags));
  }, [allTags]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.isRunning) {
            const now = Date.now();
            const elapsed = (now - task.lastStartTime) / 1000;
            return { ...task, totalTime: task.sessionTime + elapsed };
          }
          return task;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = (title, tags) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      tags,
      totalTime: 0,
      sessionTime: 0,
      isRunning: true,
      lastStartTime: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = tasks.map((task) =>
      task.isRunning
        ? { ...task, isRunning: false, sessionTime: task.totalTime }
        : task
    );

    // Add new task with an animation class
    setTasks([newTask, ...updatedTasks]);

    const newTags = new Set([...allTags, ...tags]);
    setAllTags(Array.from(newTags));
  };

  const handleToggleTask = (id) => {
    if (editingTaskId) setEditingTaskId(null); // Exit edit mode if a timer is started
    const now = Date.now();
    setTasks(
      tasks.map((task) => {
        // If this is the task we are toggling
        if (task.id === id) {
          if (task.isRunning) {
            // Pause it
            return { ...task, isRunning: false, sessionTime: task.totalTime };
          } else {
            // Start it
            return { ...task, isRunning: true, lastStartTime: now };
          }
        }
        // If another task is running, pause it
        if (task.isRunning) {
          return { ...task, isRunning: false, sessionTime: task.totalTime };
        }
        return task;
      })
    );
  };

  const handleStopTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id && task.isRunning) {
          return { ...task, isRunning: false, sessionTime: task.totalTime };
        }
        return task;
      })
    );
  };

  const handleUpdateTask = (taskId, updatedData) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updatedData, isRunning: false }
          : task
      )
    );
    const newTags = new Set([...allTags, ...updatedData.tags]);
    setAllTags(Array.from(newTags));
    setEditingTaskId(null);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto max-w-3xl p-4 sm:p-6">
        {currentView === "tasks" ? (
          <>
            <AddTaskForm onAddTask={handleAddTask} allTags={allTags} />
            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onStop={handleStopTask}
              onUpdateTask={handleUpdateTask}
              allTags={allTags}
              editingTaskId={editingTaskId}
              setEditingTaskId={setEditingTaskId}
            />
          </>
        ) : (
          <AnalysisPage tasks={tasks} />
        )}
      </main>
      <style>{`
                .task-item {
                    animation: slideIn 0.5s ease-out forwards;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </div>
  );
}
