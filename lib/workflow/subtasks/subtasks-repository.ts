"use client"

import { Subtask } from "./subtask"

export interface SubtasksRepository {
  save(subtask: Subtask): Promise<void>
  listByTaskId(taskId: string): Promise<Subtask[]>
}

interface LocalStorageSubtask {
  id: string
  taskId: string
  status: "to do" | "blocked" | "done"
  text: string
  reason: string | null
}

function localStorageSubtaskMapper(subtask: LocalStorageSubtask): Subtask {
  return Subtask.Create({
    id: subtask.id,
    taskId: subtask.taskId,
    status: subtask.status,
    text: subtask.text,
    reason: subtask.reason,
  })
}

class LocalStorageSubtasksRepository implements SubtasksRepository {
  constructor(private subtasks = "@ascend:subtasks") {
    // const seed: Array<LocalStorageSubtask> = [
    //   {
    //     id: "0",
    //     taskId: "123",
    //     status: "done",
    //     text: "Criar o design do projeto",
    //     reason: null,
    //   },
    //   {
    //     id: "01",
    //     taskId: "123",
    //     status: "done",
    //     text: "Criar o domain model das regras de negócio",
    //     reason: null,
    //   },
    //   {
    //     id: "02",
    //     taskId: "123",
    //     status: "blocked",
    //     text: "Criar todo o back-end utilizando next.js",
    //     reason: "test blocked",
    //   },
    //   {
    //     id: "10",
    //     taskId: "456",
    //     status: "done",
    //     text: "PR",
    //     reason: null,
    //   },
    //   {
    //     id: "11",
    //     taskId: "456",
    //     status: "done",
    //     text: "Teste em DEV",
    //     reason: null,
    //   },
    //   {
    //     id: "12",
    //     taskId: "456",
    //     status: "done",
    //     text: "Merge",
    //     reason: null,
    //   },
    //   {
    //     id: "13",
    //     taskId: "456",
    //     status: "done",
    //     text: "Teste em HMG",
    //     reason: null,
    //   },
    //   {
    //     id: "14",
    //     taskId: "456",
    //     status: "done",
    //     text: "Homologação",
    //     reason: null,
    //   },
    //   {
    //     id: "20",
    //     taskId: "789",
    //     status: "to do",
    //     text: "PR",
    //     reason: null,
    //   },
    //   {
    //     id: "21",
    //     taskId: "789",
    //     status: "to do",
    //     text: "Teste em DEV",
    //     reason: null,
    //   },
    //   {
    //     id: "22",
    //     taskId: "789",
    //     status: "to do",
    //     text: "Merge",
    //     reason: null,
    //   },
    //   {
    //     id: "23",
    //     taskId: "789",
    //     status: "to do",
    //     text: "Teste em HMG",
    //     reason: null,
    //   },
    //   {
    //     id: "24",
    //     taskId: "789",
    //     status: "to do",
    //     text: "Homologação",
    //     reason: null,
    //   },
    // ]
    // localStorage.setItem(this.subtasks, JSON.stringify(seed))
  }

  async save(subtask: Subtask): Promise<void> {
    const subtasks = JSON.parse(
      localStorage.getItem(this.subtasks)!
    ) as Array<LocalStorageSubtask>

    const subtaskEntry = subtasks.findIndex((s) => s.id === subtask.id)

    const newSubtask: LocalStorageSubtask = {
      id: subtask.id,
      taskId: subtask.taskId,
      status: subtask.status,
      text: subtask.text,
      reason: subtask.reason,
    }

    if (subtaskEntry > 0 && subtasks[subtaskEntry] !== newSubtask) {
      subtasks[subtaskEntry] = newSubtask
    } else {
      subtasks.push(newSubtask)
    }

    localStorage.setItem(this.subtasks, JSON.stringify(subtasks))
  }

  async listByTaskId(taskId: string): Promise<Subtask[]> {
    const subtasks = JSON.parse(
      localStorage.getItem(this.subtasks)!
    ) as Array<LocalStorageSubtask>

    return subtasks
      .filter((s) => s.taskId === taskId)
      .map(localStorageSubtaskMapper)
  }
}

export const subtasksRepository = () => new LocalStorageSubtasksRepository()
