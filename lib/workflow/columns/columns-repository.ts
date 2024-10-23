"use client"

import { Column } from "./column"
import {
  tasksRepository,
  TasksRepository,
} from "@/lib/workflow/tasks/tasks-repository"

export interface ColumnsRepository {
  list(): Promise<Column[]>
  retrieve(id: string): Promise<Column | null>

  save(column: Column): Promise<void>
  remove(id: string): Promise<void>
}

interface LocalStorageColumn {
  id: string
  title: string
  icon: string
}

class LocalStorageColumnsRepository implements ColumnsRepository {
  constructor(
    private tasksRepository: TasksRepository,
    private columns = "@ascend:columns"
  ) {
    // const seed = [
    //   {
    //     id: "1",
    //     title: "Projetos",
    //     icon: "🎯",
    //   },
    //   {
    //     id: "2",
    //     title: "Minu",
    //     icon: "👨🏻‍💻",
    //   },
    //   {
    //     id: "3",
    //     title: "Investimentos",
    //     icon: "💸",
    //   },
    // ]
    // localStorage.setItem(this.columns, JSON.stringify(seed))
  }

  private getColumns() {
    return JSON.parse(
      localStorage.getItem(this.columns)!
    ) as Array<LocalStorageColumn>
  }

  async save(column: Column): Promise<void> {
    const columns = this.getColumns()
    const columnEntry = columns.findIndex((c) => c.id === column.id)

    const newColumn: LocalStorageColumn = {
      id: column.id,
      title: column.title,
      icon: column.icon,
    }

    if (columnEntry === -1) {
      columns.push(newColumn)
    } else {
      columns[columnEntry] = newColumn
    }

    localStorage.setItem(this.columns, JSON.stringify(columns))

    await this.tasksRepository.bulkSave(column.tasks, column.id)
  }

  async list(): Promise<Column[]> {
    const columns = JSON.parse(
      localStorage.getItem(this.columns)!
    ) as Array<LocalStorageColumn>

    const mapped = columns.map(async (column) => {
      const tasks = await this.tasksRepository.listByColumnId(column.id)

      return Column.Create({
        id: column.id,
        title: column.title,
        icon: column.icon,
        tasks,
      })
    })

    return Promise.all(mapped)
  }

  async retrieve(id: string): Promise<Column | null> {
    const columns = this.getColumns()

    const column = columns.find((column) => column.id === id)

    if (!column) {
      return null
    }

    const tasks = await this.tasksRepository.listByColumnId(id)

    return Column.Create({
      id: column.id,
      title: column.title,
      icon: column.icon,
      tasks,
    })
  }

  async remove(id: string): Promise<void> {
    const columns = JSON.parse(
      localStorage.getItem(this.columns)!
    ) as Array<LocalStorageColumn>

    const filtered = columns.filter((column) => column.id !== id)

    localStorage.setItem(this.columns, JSON.stringify(filtered))
  }
}

export const columnsRepository = () =>
  new LocalStorageColumnsRepository(tasksRepository())
