import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface DeleteSubtaskRequest {
  columnId: string
  taskId: string
  subtaskId: string
}

export async function deleteSubtask(
  props: DeleteSubtaskRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  const task = column.FindTask(props.taskId)

  if (!task) {
    throw Result.Fail("Task not found")
  }

  task.RemoveSubtask(props.subtaskId)

  await columnsRepository().save(column)
}
