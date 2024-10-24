import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface UnblockTaskRequest {
  columnId: string
  taskId: string
}

export async function unblockTask(props: UnblockTaskRequest): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  const task = column.FindTask(props.taskId)

  if (!task) {
    throw Result.Fail("Task not found")
  }

  task.Unblock(props.taskId)

  await columnsRepository().save(column)
}
