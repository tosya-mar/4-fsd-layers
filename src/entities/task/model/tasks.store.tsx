import { nanoid } from "nanoid";
import { create } from "zustand";
import { tasksRepository } from "./tasks.repository";
import { CreateTaskData, Task, UpdateTaskData } from "..";

export type TasksStore = {
  tasks: Task[];
  getTaskById: (id: string) => Task | undefined;
  loadTasks: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  removeTask: (userId: string) => Promise<void>;
};

export const useTasks = create<TasksStore>((set, get) => ({
  tasks: [],
  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
  },
  loadTasks: async () => {
    set({
      tasks: await tasksRepository.getTasks(),
    });
  },
  createTask: async (data) => {
    const newTask = { id: nanoid(), ...data, cols: [] };
    await tasksRepository.saveTask(newTask);

    const tasksNew = await tasksRepository.getTasks();
    set({
      tasks: tasksNew,
    });
  },
  updateTask: async (id, data) => {
    const task = await tasksRepository.getTask(id);
    if (!task) return;
    const newTask = { ...task, ...data };

    await tasksRepository.saveTask(newTask);
    set({
      tasks: await tasksRepository.getTasks(),
    });
  },
  removeTask: async (userId: string) => {
    await tasksRepository.removeTask(userId);
    set({
      tasks: await tasksRepository.getTasks(),
    });
  },
}));
