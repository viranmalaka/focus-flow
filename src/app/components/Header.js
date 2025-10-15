import React from "react";
import { ListIcon } from "./icons";
import { ChartIcon } from "./icons";

export const Header = ({ currentView, setCurrentView }) => (
  <header className="bg-slate-800 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wider">FocusFlow</h1>
      <nav>
        <button
          onClick={() => setCurrentView("tasks")}
          className={`p-2 rounded-lg transition-colors duration-300 ${
            currentView === "tasks"
              ? "bg-sky-500"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
          aria-label="Tasks View"
        >
          <ListIcon />
        </button>
        <button
          onClick={() => setCurrentView("analysis")}
          className={`ml-2 p-2 rounded-lg transition-colors duration-300 ${
            currentView === "analysis"
              ? "bg-sky-500"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
          aria-label="Analysis View"
        >
          <ChartIcon />
        </button>
      </nav>
    </div>
  </header>
);
