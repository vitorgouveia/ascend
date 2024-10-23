import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface EditTaskTitleRequest {
  taskId: string
  columnId: string
  title: string
}

export async function editTaskTitle(
  props: EditTaskTitleRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found!")
  }

  column.EditTaskTitle(props.taskId, props.title)

  await columnsRepository().save(column)
}
