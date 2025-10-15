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

  const handleAddTask = (title, tags) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      tags,
      sessions: [{ startTime: new Date().toISOString(), endTime: null }],
      isRunning: true,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = tasks.map((task) => {
      if (task.isRunning) {
        const lastSession = task.sessions[task.sessions.length - 1];
        lastSession.endTime = new Date().toISOString();
        return { ...task, isRunning: false };
      }
      return task;
    });

    setTasks([newTask, ...updatedTasks]);

    const newTags = new Set([...allTags, ...tags]);
    setAllTags(Array.from(newTags));
  };

  const handleToggleTask = (id) => {
    if (editingTaskId) setEditingTaskId(null);
    const now = new Date().toISOString();
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          if (task.isRunning) {
            const lastSession = task.sessions[task.sessions.length - 1];
            lastSession.endTime = now;
            return { ...task, isRunning: false };
          } else {
            return {
              ...task,
              isRunning: true,
              sessions: [
                ...task.sessions,
                { startTime: now, endTime: null },
              ],
            };
          }
        }
        if (task.isRunning) {
          const lastSession = task.sessions[task.sessions.length - 1];
          lastSession.endTime = now;
          return { ...task, isRunning: false };
        }
        return task;
      })
    );
  };

  const handleStopTask = (id) => {
    const now = new Date().toISOString();
    setTasks(
      tasks.map((task) => {
        if (task.id === id && task.isRunning) {
          const lastSession = task.sessions[task.sessions.length - 1];
          lastSession.endTime = now;
          return { ...task, isRunning: false };
        }
        return task;
      })
    );
  };

  const handleUpdateTask = (taskId, updatedData) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    );
    const newTags = new Set([...allTags, ...updatedData.tags]);
    setAllTags(Array.from(newTags));
    setEditingTaskId(null);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingTaskId === id) setEditingTaskId(null);
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
              onDeleteTask={handleDeleteTask}
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
