import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface DeleteTaskRequest {
  columnId: string
  taskId: string
}

export async function deleteTask(props: DeleteTaskRequest): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  column.RemoveTask(props.taskId)

  await columnsRepository().save(column)
}
