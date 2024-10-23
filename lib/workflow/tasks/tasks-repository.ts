"use client"

import {
  subtasksRepository,
  SubtasksRepository,
} from "../subtasks/subtasks-repository"
import { Task, TaskStatus } from "./task"

export interface TasksRepository {
  listByColumnId(columnId: string): Promise<Task[]>

  bulkSave(tasks: Task[], columnId: string): Promise<void>
  remove(id: string): Promise<void>
}

interface LocalStorageTask {
  id: string
  columnId: string
  title: string
  status: TaskStatus
  reason?: string
}

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

  private getTasks() {
    return JSON.parse(
      localStorage.getItem(this.tasks)!
    ) as Array<LocalStorageTask>
  }

  async bulkSave(tasks: Task[], columnId: string): Promise<void> {
    const taskList = this.getTasks()

    for (const task of tasks) {
      const newTask: LocalStorageTask = {
        id: task.id,
        columnId: task.columnId,
        status: task.status,
        title: task.title,
        reason: task.reason,
      }

      const taskEntry = taskList.findIndex((t) => t.id === task.id)

      if (taskEntry === -1) {
        taskList.push(newTask)
      } else {
        taskList[taskEntry] = newTask
      }
    }

    localStorage.setItem(this.tasks, JSON.stringify(taskList))

    const tasksToBeDeleted = taskList
      .filter((task) => task.columnId === columnId)
      .filter((task) => !tasks.find((t) => t.id === task.id))

    for (const task of tasksToBeDeleted) {
      await this.remove(task.id)
    }
    // for (const subtask of task.subtasks) {
    //   await this.subtasksRepository.save(subtask)
    // }
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
