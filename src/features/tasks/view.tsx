import { Task, useTasks } from "@/entities/task";
import { Session, useSession } from "@/entities/session";

function canViewTask(task?: Task, session?: Session) {
  console.log(task);

  if (!task) return false;
  return session && task.authorId === session?.userId;
}

export function useCanViewTasksFn() {
  const session = useSession((s) => s.currentSession);
  const getTaskById = useTasks((s) => s.getTaskById);

  return (taskId: string) => {
    const task = getTaskById(taskId);
    return canViewTask(task, session);
  };
}
