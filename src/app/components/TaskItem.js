import { formatTime } from "./utils";
import { EditTaskForm } from "./EditTaskForm";
import { PlayIcon, PauseIcon, StopIcon, EditIcon } from "./icons";

export const TaskItem = ({
  task,
  onToggle,
  onStop,
  onUpdateTask,
  allTags,
  isEditing,
  onSetEditing,
}) => {
  const { title, tags, totalTime, isRunning } = task;

  if (isEditing) {
    return (
      <EditTaskForm
        task={task}
        onUpdateTask={onUpdateTask}
        onCancel={() => onSetEditing(null)}
        allTags={allTags}
      />
    );
  }

  const handleEditClick = () => {
    if (!isRunning) {
      onSetEditing(task.id);
    }
  };

  return (
    <div
      className={`
            flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl shadow-lg transition-all duration-300
            ${
              isRunning
                ? "bg-sky-900/50 border-2 border-sky-500"
                : "bg-slate-800 hover:bg-slate-700"
            }
        `}
    >
      <div className="flex-1 mb-4 sm:mb-0 text-center sm:text-left">
        <h3 className="font-bold text-lg text-white">{title}</h3>
        <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <p className="text-2xl font-mono text-white w-32 text-center">
          {formatTime(totalTime)}
        </p>
        <button
          onClick={() => onToggle(task.id)}
          className={`p-3 rounded-full transition-colors duration-300 ${
            isRunning
              ? "bg-amber-500 hover:bg-amber-400"
              : "bg-green-500 hover:bg-green-400"
          } text-white`}
          aria-label={isRunning ? "Pause Task" : "Start Task"}
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          onClick={() => onStop(task.id)}
          className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors duration-300"
          aria-label="Stop and complete task"
        >
          <StopIcon />
        </button>
        <button
          onClick={handleEditClick}
          className="p-3 rounded-full bg-slate-600 hover:bg-slate-500 text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Edit task"
          disabled={isRunning}
        >
          <EditIcon />
        </button>
      </div>
    </div>
  );
};
