import { isToday, formatTime } from "./utils";

export const AnalysisPage = ({ tasks }) => {
  const todaysTasks = tasks.filter((task) => isToday(task.createdAt));

  if (todaysTasks.length === 0) {
    return (
      <p className="text-center text-slate-400 mt-8 p-4">
        No tasks tracked today. Your daily summary will appear here.
      </p>
    );
  }

  const totalTimeToday = todaysTasks.reduce(
    (acc, task) => acc + task.totalTime,
    0
  );

  const timeByTag = todaysTasks.reduce((acc, task) => {
    task.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag] += task.totalTime;
    });
    return acc;
  }, {});

  const sortedTags = Object.entries(timeByTag).sort(([, a], [, b]) => b - a);

  const tagColors = [
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
    "bg-lime-500",
    "bg-cyan-500",
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-2">Today's Summary</h2>
        <p className="text-4xl font-bold text-sky-400">
          {formatTime(totalTimeToday)}
        </p>
        <p className="text-slate-400 mb-4">Total time spent on tasks today.</p>

        <div className="w-full flex h-4 rounded-full overflow-hidden bg-slate-700 mb-3">
          {sortedTags.map(([tag, time], index) => {
            const percentage = (time / totalTimeToday) * 100;
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
                  style={{ width: `${(time / totalTimeToday) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Task Breakdown</h2>
        <ul className="space-y-3">
          {todaysTasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center text-slate-300 p-3 bg-slate-700/50 rounded-lg"
            >
              <span>{task.title}</span>
              <span className="font-mono">{formatTime(task.totalTime)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
