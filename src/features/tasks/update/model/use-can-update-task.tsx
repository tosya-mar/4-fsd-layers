import { Session, useSession } from "@/entities/session";
import { Task, useTasks } from "@/entities/task";

export function canUpdateTask(task?: Task, session?: Session) {
  if (!task) return false;
  return session?.userId === task?.authorId;
}

export function useCanUpdateTaskFn() {
  const session = useSession((s) => s.currentSession);
  const getTaskById = useTasks((s) => s.getTaskById);
  return (boardId: string) => {
    const board = getTaskById(boardId);
    return canUpdateTask(board, session);
  };
}

export function useCanUpdateTask(boardId: string) {
  const board = useTasks((s) => s.getTaskById(boardId));
  const session = useSession((s) => s.currentSession);
  return canUpdateTask(board, session);
}
