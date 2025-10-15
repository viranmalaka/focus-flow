"use client";
import { useState, useMemo } from "react";
import { formatTime, calculateTotalTime } from "./utils";

export const AnalysisPage = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState("today");

  const allDates = useMemo(() => {
    const dates = new Set();
    tasks.forEach((task) => {
      task.sessions?.forEach((session) => {
        dates.add(new Date(session.startTime).toISOString().split("T")[0]);
      });
    });
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (selectedDate === "all") {
      return tasks
        .map((task) => ({
          ...task,
          timeForDate: calculateTotalTime(task.sessions),
        }))
        .filter((task) => task.timeForDate > 0);
    }

    const targetDate =
      selectedDate === "today"
        ? new Date().toISOString().split("T")[0]
        : selectedDate;

    return tasks
      .map((task) => {
        const sessionsForDate = task.sessions?.filter(
          (session) =>
            new Date(session.startTime).toISOString().split("T")[0] ===
            targetDate
        );
        return {
          ...task,
          timeForDate: calculateTotalTime(sessionsForDate),
        };
      })
      .filter((task) => task.timeForDate > 0);
  }, [tasks, selectedDate]);

  const totalTime = filteredTasks.reduce(
    (acc, task) => acc + task.timeForDate,
    0
  );

  const timeByTag = filteredTasks.reduce((acc, task) => {
    task.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag] += task.timeForDate;
    });
    return acc;
  }, {});

  const sortedTags = Object.entries(timeByTag).sort(([, a], [, b]) => b - a);

  if (tasks.length === 0) {
    return (
      <p className="text-center text-slate-400 mt-8 p-4">
        No tasks tracked yet. Your summary will appear here once you track some
        time.
      </p>
    );
  }

  const tagColors = [
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
    "bg-lime-500",
    "bg-cyan-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-center sm:justify-end">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-700 text-white rounded-md px-3 py-2"
        >
          <option value="today">Today</option>
          <option value="all">All Time</option>
          {allDates.map((date) => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-slate-400 mt-8 p-4">
          No tasks tracked for this period.
        </p>
      ) : (
        <>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">Summary</h2>
            <p className="text-4xl font-bold text-sky-400">
              {formatTime(totalTime)}
            </p>
            <p className="text-slate-400 mb-4">
              Total time spent on tasks for the selected period.
            </p>

            <div className="w-full flex h-4 rounded-full overflow-hidden bg-slate-700 mb-3">
              {sortedTags.map(([tag, time], index) => {
                const percentage = (time / totalTime) * 100;
                const colorClass = tagColors[index % tagColors.length];
                return (
                  <div
                    key={tag}
                    className={`${colorClass}`}
                    style={{ width: `${percentage}%` }}
                    title={`${tag}: ${formatTime(time)}`}
                  ></div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              {sortedTags.map(([tag], index) => {
                const colorClass = tagColors[index % tagColors.length];
                return (
                  <div key={tag} className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-sm mr-2 ${colorClass}`}
                    ></span>
                    <span className="text-slate-300">{tag}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Time by Tag</h2>
            <div className="space-y-4">
              {sortedTags.map(([tag, time]) => (
                <div key={tag}>
                  <div className="flex justify-between items-center mb-1 text-slate-300">
                    <span className="font-semibold">{tag}</span>
                    <span>{formatTime(time)}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                      className="bg-sky-500 h-2.5 rounded-full"
                      style={{ width: `${(time / totalTime) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              Task Breakdown
            </h2>
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center text-slate-300 p-3 bg-slate-700/50 rounded-lg"
                >
                  <span>{task.title}</span>
                  <span className="font-mono">
                    {formatTime(task.timeForDate)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};