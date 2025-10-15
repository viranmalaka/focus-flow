import { TaskItem } from "./TaskItem";

export const TaskList = ({
  tasks,
  onToggle,
  onStop,
  onUpdateTask,
  allTags,
  editingTaskId,
  setEditingTaskId,
}) => {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-slate-400 mt-8">
        No tasks yet. Add one to get started!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <TaskItem
            task={task}
            onToggle={onToggle}
            onStop={onStop}
            onUpdateTask={onUpdateTask}
            allTags={allTags}
            isEditing={task.id === editingTaskId}
            onSetEditing={setEditingTaskId}
          />
        </div>
      ))}
    </div>
  );
};
