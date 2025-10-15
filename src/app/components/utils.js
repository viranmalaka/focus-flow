export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00:00";
  }
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export const isToday = (date) => {
  const today = new Date();
  const taskDate = new Date(date);
  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
};

export const calculateTotalTime = (sessions) => {
  if (!sessions) return 0;

  return (
    sessions.reduce((total, session) => {
      const startTime = new Date(session.startTime).getTime();
      const endTime = session.endTime
        ? new Date(session.endTime).getTime()
        : new Date().getTime();
      return total + (endTime - startTime);
    }, 0) / 1000
  );
};
