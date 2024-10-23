import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface CreateTaskRequest {
  columnId: string
  title: string
}

export async function createTask(props: CreateTaskRequest): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  column.AddTask({
    title: props.title,
  })

  await columnsRepository().save(column)
}
