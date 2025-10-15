import React, { useState, useRef } from "react";

export const AddTaskForm = ({ onAddTask, allTags }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

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
    inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onAddTask(title, tagList);
    setTitle("");
    setTags("");
  };

  return (
    <div className="mb-8 p-4 bg-slate-700 rounded-xl shadow-inner transition-all duration-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you working on?"
          className="w-full p-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        />
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={tags}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={handleTagChange}
            placeholder="Add tags (e.g., meeting, urgent)"
            className="w-full p-3 bg-slate-800 border-2 border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
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
        <button
          type="submit"
          className="w-full p-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition transform hover:scale-105"
        >
          Add & Start Task
        </button>
      </form>
    </div>
  );
};
