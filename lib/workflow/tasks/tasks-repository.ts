"use client"

import {
  subtasksRepository,
  SubtasksRepository,
} from "../subtasks/subtasks-repository"
import { Task } from "./task"

export interface TasksRepository {
  save(task: Task): Promise<void>
  remove(id: string): Promise<void>
  listByColumnId(columnId: string): Promise<Task[]>
}

interface LocalStorageTask {
  id: string
  columnId: string
  title: string
  status: "to do"
}

// function localStorageTaskMapper(task: LocalStorageTask): Task {
//   return Task.Create({
//     id: task.id,
//     columnId: task.columnId,
//     status: task.status,
//     title: task.title,
//   })
// }

class LocalStorageTasksRepository implements TasksRepository {
  constructor(
    private subtasksRepository: SubtasksRepository,
    private tasks = "@ascend:tasks"
  ) {
    // const seed: Array<LocalStorageTask> = [
    //   {
    //     id: "123",
    //     columnId: "1",
    //     title: "Ascend | ⌛ Non-blocking task management.",
    //     status: "to do",
    //   },
    //   {
    //     id: "456",
    //     columnId: "2",
    //     title: "bonuz-file-processor",
    //     status: "to do",
    //   },
    //   {
    //     id: "789",
    //     columnId: "2",
    //     title: "bonuz-webhook",
    //     status: "to do",
    //   },
    // ]
    // localStorage.setItem(this.tasks, JSON.stringify(seed))
  }

  async save(task: Task): Promise<void> {
    const tasks = JSON.parse(
      localStorage.getItem(this.tasks)!
    ) as Array<LocalStorageTask>

    const taskEntry = tasks.findIndex((t) => t.id === task.id)

    const newTask: LocalStorageTask = {
      id: task.id,
      columnId: task.columnId,
      status: task.status,
      title: task.title,
    }

    if (taskEntry > 0 && tasks[taskEntry] !== newTask) {
      tasks[taskEntry] = newTask
    } else {
      tasks.push(newTask)
    }

    localStorage.setItem(this.tasks, JSON.stringify(tasks))

    for (const subtask of task.subtasks) {
      await this.subtasksRepository.save(subtask)
    }
  }

  async remove(id: string): Promise<void> {
    const tasks = JSON.parse(
      localStorage.getItem(this.tasks)!
    ) as Array<LocalStorageTask>

    const filteredTasks = tasks.filter((t) => t.id !== id)

    localStorage.setItem(this.tasks, JSON.stringify(filteredTasks))
  }

  async listByColumnId(columnId: string): Promise<Task[]> {
    const tasks = JSON.parse(
      localStorage.getItem(this.tasks)!
    ) as Array<LocalStorageTask>

    const mapped = tasks
      .filter((t) => t.columnId === columnId)
      .map(async (task) => {
        const subtasks = await this.subtasksRepository.listByTaskId(task.id)

        return Task.Create({
          id: task.id,
          columnId: task.columnId,
          status: task.status,
          title: task.title,
          subtasks,
        })
      })

    return Promise.all(mapped)
  }
}

export const tasksRepository = () =>
  new LocalStorageTasksRepository(subtasksRepository())
