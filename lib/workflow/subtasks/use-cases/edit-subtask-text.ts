import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface EditSubtaskTextRequest {
  columnId: string
  taskId: string
  subtaskId: string
  text: string
}

export async function editSubtaskText(
  props: EditSubtaskTextRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  const task = column.FindTask(props.taskId)

  if (!task) {
    throw Result.Fail("Task not found")
  }

  task.EditSubtaskText(props.subtaskId, props.text)

  await columnsRepository().save(column)
}
