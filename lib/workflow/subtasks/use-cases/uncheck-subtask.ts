import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface UncheckSubtaskRequest {
  columnId: string
  taskId: string
  subtaskId: string
}

export async function uncheckSubtask(
  props: UncheckSubtaskRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  const task = column.FindTask(props.taskId)

  if (!task) {
    throw Result.Fail("Task not found")
  }

  task.UncheckSubtask(props.subtaskId)

  await columnsRepository().save(column)
}
