import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface BlockTaskRequest {
  columnId: string
  taskId: string
  reason: string
}

export async function blockTask(props: BlockTaskRequest): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  column.BlockTask(props.taskId, props.reason)

  await columnsRepository().save(column)
}
