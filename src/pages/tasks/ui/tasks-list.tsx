import { useBoards } from "@/entities/board";
import { useTasks } from "@/entities/task";
import { UserPreview, useUsers } from "@/entities/user";
import { RemoveTaskButton } from "@/features/tasks/remove";
import { UpdateTaskButton } from "@/features/tasks/update";
import { useCanViewTasksFn } from "@/features/tasks/view";

export function TasksList({ className }: { className?: string }) {
  const { tasks } = useTasks();
  const users = useUsers((s) => s.usersMap());
  const { getBoardById } = useBoards();

  const getBoardName = (boardId: string) => {
    return getBoardById(boardId)?.name;
  };

  const canViewTasks = useCanViewTasksFn();

  return (
    <div className={className}>
      <h2 className="text-lg mb-2 font-semibold">Все задачи</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-start">Название:</th>
            <th className="text-start">Описание:</th>
            <th className="text-start">Автор:</th>
            <th className="text-start">Доска:</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks
            .filter((task) => canViewTasks(task.id))
            .map((task) => (
              <tr
                key={task.id}
                className="px-5 py-2 border-b border-b-slate-3 "
              >
                <td className="p-2">{task.title}</td>
                <td className="p-2">{task.description}</td>
                <td className="p-2">
                  <UserPreview size="md" {...users[task.authorId]} />
                </td>
                <td className="p-2">
                  {getBoardName(task.boardId ? task.boardId : "")}
                </td>
                <td className="p-2">
                  <div className="flex gap-2 ml-auto">
                    <UpdateTaskButton taskId={task.id} />
                    <RemoveTaskButton taskId={task.id} />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
