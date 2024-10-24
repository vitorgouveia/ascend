import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface EditSubtaskReasonRequest {
  columnId: string
  taskId: string
  subtaskId: string
  reason: string
}

export async function editSubtaskReason(
  props: EditSubtaskReasonRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  const task = column.FindTask(props.taskId)

  if (!task) {
    throw Result.Fail("Task not found")
  }

  task.EditSubtaskReason(props.subtaskId, props.reason)

  await columnsRepository().save(column)
}
