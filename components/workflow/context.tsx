"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { toast } from "sonner"

// import { Task } from "@/lib/workflow/tasks/task"
import { Column } from "@/lib/workflow/columns/column"

import { columnsRepository } from "@/lib/workflow/columns/columns-repository"
// import { tasksRepository } from "@/lib/workflow/tasks/tasks-repository"
// import { subtasksRepository } from "@/lib/workflow/subtasks/subtasks-repository"

import {
  createColumn as createColumnUseCase,
  CreateColumnRequest,
} from "@/lib/workflow/columns/use-cases/create-column"

import {
  editColumnTitle as editColumnTitleUseCase,
  EditColumnTitleRequest,
} from "@/lib/workflow/columns/use-cases/edit-column-title"

import {
  editColumnIcon as editColumnIconUseCase,
  EditColumnIconRequest,
} from "@/lib/workflow/columns/use-cases/edit-column-icon"

import {
  deleteColumn as deleteColumnUseCase,
  DeleteColumnRequest,
} from "@/lib/workflow/columns/use-cases/delete-column"

import { Result } from "@/lib/result"

interface WorkflowContext {
  columns: {
    list: Array<Column>
    create(props: CreateColumnRequest): Promise<void>
    editTitle(props: EditColumnTitleRequest): Promise<void>
    editIcon(props: EditColumnIconRequest): Promise<void>
    delete(props: DeleteColumnRequest): Promise<void>
  }
  // blockTask(props: {
  //   columnId: string
  //   taskId: string
  //   reason: string
  // }): Promise<void>
  // createTask: (task: Task) => Promise<void>
  // editTaskTitle: (props: {
  //   title: string
  //   columnId: string
  //   taskId: string
  // }) => Promise<void>
  // deleteTask: (columnId: string, taskId: string) => Promise<void>
  // columns: Array<Column>
  // createColumn: (column: Column) => Promise<void>
  // deleteColumn: (id: string) => Promise<Column | null>
}

const WorkflowContext = createContext<WorkflowContext>({
  columns: {
    list: [],
    create: async () => {},
    editTitle: async () => {},
    editIcon: async () => {},
    delete: async () => {},
  },
  // blockTask: async () => {},
  // createTask: async () => {},
  // editTaskTitle: async () => {},
  // deleteTask: async () => {},
  // columns: [],
  // createColumn: async () => {},
  // deleteColumn: async () => null,
})

export function workflow() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(WorkflowContext)
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<Column[]>([])

  useEffect(() => {
    columnsRepository().list().then(setColumns)
  }, [])

  // const createTask = useCallback(
  //   async (task: Task) => {
  //     await tasksRepository().save(task)

  //     const index = columns.findIndex((column) => column.id === task.columnId)

  //     if (index === -1) {
  //       return
  //     }

  //     const column = columns[index]

  //     column.tasks.push(task)

  //     setColumns(columns.toSpliced(index, 1, column))

  //     return
  //   },
  //   [columns]
  // )

  // const editTaskTitle = useCallback(
  //   async (props: { title: string; columnId: string; taskId: string }) => {
  //     const column = columns.find((column) => column.id === props.columnId)

  //     if (!column) {
  //       return
  //     }

  //     const task = column.tasks.find((task) => task.id === props.taskId)

  //     if (!task) {
  //       return
  //     }

  //     task.title = props.title

  //     await tasksRepository().save(task)

  //     setColumns((columns) => {
  //       const columnIndex = columns.findIndex(
  //         (column) => column.id === props.columnId
  //       )

  //       if (columnIndex === -1) {
  //         return columns
  //       }

  //       return columns.map((column, index) => {
  //         if (index === columnIndex) {
  //           const taskIndex = column.tasks.findIndex(
  //             (task) => task.id === props.taskId
  //           )

  //           const task = column.tasks[taskIndex]

  //           task.title = props.title

  //           column.tasks = column.tasks.toSpliced(taskIndex, 1, task)

  //           return column
  //         }

  //         return column
  //       })
  //     })
  //   },
  //   [columns]
  // )

  // const blockTask = useCallback(
  //   async (props: { taskId: string; columnId: string; reason: string }) => {
  //     const column = columns.find((column) => column.id === props.columnId)

  //     if (!column) {
  //       return
  //     }

  //     const task = column.tasks.find((task) => task.id === props.taskId)

  //     if (!task) {
  //       return
  //     }

  //     const subtask = task.subtasks.find((s) => s.status === "to do")

  //     if (!subtask) {
  //       return
  //     }

  //     subtask.Block(props.reason)

  //     // TODO: call use-case and 'refetch'

  //     await subtasksRepository().save(subtask)

  //     setColumns((columns) => {
  //       const columnIndex = columns.findIndex(
  //         (column) => column.id === props.columnId
  //       )

  //       if (columnIndex === -1) {
  //         return columns
  //       }

  //       return columns.map((column, index) => {
  //         if (index === columnIndex) {
  //           const taskIndex = column.tasks.findIndex(
  //             (task) => task.id === props.taskId
  //           )

  //           const task = column.tasks[taskIndex]

  //           const subtaskIndex = task.subtasks.findIndex(
  //             (s) => s.id === subtask.id
  //           )

  //           task.subtasks = task.subtasks.toSpliced(subtaskIndex, 1, subtask)

  //           column.tasks = column.tasks.toSpliced(taskIndex, 1, task)

  //           return column
  //         }

  //         return column
  //       })
  //     })

  //     // setFetch((c) => c + 1)
  //   },
  //   [columns]
  // )

  // const deleteTask = useCallback(
  //   async (columnId: string, taskId: string) => {
  //     await tasksRepository().remove(taskId)

  //     setColumns((columns) => {
  //       const columnIndex = columns.findIndex(
  //         (column) => column.id === columnId
  //       )

  //       if (columnIndex === -1) {
  //         return columns
  //       }

  //       return columns.map((column, index) => {
  //         if (index === columnIndex) {
  //           column.tasks = column.tasks.filter((t) => t.id !== taskId)
  //           return column
  //         }

  //         return column
  //       })
  //     })
  //   },
  //   [columns]
  // )

  const createColumn = useCallback(async (props: CreateColumnRequest) => {
    try {
      await createColumnUseCase({
        title: props.title,
        icon: props.icon,
      })

      const columns = await columnsRepository().list()

      setColumns(columns)
    } catch (error) {
      if (Result.ok(error)) {
        toast.error(error.data)
      }
    }
  }, [])

  const editColumnTitle = useCallback(async (props: EditColumnTitleRequest) => {
    try {
      setColumns((columns) => {
        const index = columns.findIndex(
          (column) => column.id === props.columnId
        )

        if (index === -1) {
          return columns
        }

        const column = columns[index]

        column.EditTitle(props.title)

        return columns.toSpliced(index, 1, column)
      })

      await editColumnTitleUseCase({
        columnId: props.columnId,
        title: props.title,
      })
    } catch (error) {
      if (Result.ok(error)) {
        toast.error(error.data)
      }
    }
  }, [])

  const editColumnIcon = useCallback(async (props: EditColumnIconRequest) => {
    try {
      setColumns((columns) => {
        const index = columns.findIndex(
          (column) => column.id === props.columnId
        )

        if (index === -1) {
          return columns
        }

        const column = columns[index]

        column.EditIcon(props.icon)

        return columns.toSpliced(index, 1, column)
      })

      await editColumnIconUseCase({
        columnId: props.columnId,
        icon: props.icon,
      })
    } catch (error) {
      if (Result.ok(error)) {
        toast.error(error.data)
      }
    }
  }, [])

  const deleteColumn = useCallback(async (props: DeleteColumnRequest) => {
    try {
      setColumns((columns) => {
        return columns.filter((column) => column.id !== props.columnId)
      })

      await deleteColumnUseCase({
        columnId: props.columnId,
      })
    } catch (error) {
      if (Result.ok(error)) {
        toast.error(error.data)
      }
    }
  }, [])

  return (
    <WorkflowContext.Provider
      value={{
        columns: {
          list: columns,
          create: createColumn,
          editTitle: editColumnTitle,
          editIcon: editColumnIcon,
          delete: deleteColumn,
        },
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}
