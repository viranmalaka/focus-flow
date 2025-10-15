import React, { useState, useRef } from "react";

export const EditTaskForm = ({ task, onUpdateTask, onCancel, allTags }) => {
  const [title, setTitle] = useState(task.title);
  const [tags, setTags] = useState(task.tags.join(", "));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const tagInputRef = useRef(null);

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags(value);
    if (value.length > 0) {
      const lastTag = value.split(",").pop().trim().toLowerCase();
      if (lastTag) {
        const filtered = allTags.filter(
          (t) =>
            t.toLowerCase().startsWith(lastTag) &&
            !value.toLowerCase().includes(t.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tag) => {
    const tagParts = tags.split(",").map((t) => t.trim());
    tagParts.pop();
    tagParts.push(tag);
    setTags(tagParts.join(", ") + ", ");
    setSuggestions([]);
    tagInputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    let newTotalTime = task.sessionTime;

    if (startTime && endTime) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayDateString = `${year}-${month}-${day}`;

      const start = new Date(`${todayDateString}T${startTime}`);
      const end = new Date(`${todayDateString}T${endTime}`);

      if (end <= start) {
        setError("End time must be after start time.");
        return;
      }
      newTotalTime = (end - start) / 1000;
    } else if (startTime || endTime) {
      setError("Both start and end time must be set to manually log time.");
      return;
    }

    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    const updatedTaskData = {
      title: title.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      totalTime: newTotalTime,
      sessionTime: newTotalTime,
    };
    onUpdateTask(task.id, updatedTaskData);
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border-2 border-sky-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-bold text-white mb-2">Edit Task</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full p-3 bg-slate-900 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <div className="relative">
          <input
            ref={tagInputRef}
            type="text"
            value={tags}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={handleTagChange}
            placeholder="Add tags (e.g., meeting, urgent)"
            className="w-full p-3 bg-slate-900 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {isFocused && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {suggestions.map((tag, index) => (
                <li
                  key={index}
                  onClick={() => addTag(tag)}
                  className="p-2 text-white hover:bg-sky-600 cursor-pointer"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Manual Time Entry (Optional)
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 bg-slate-900 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-3 bg-slate-900 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full p-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full p-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
