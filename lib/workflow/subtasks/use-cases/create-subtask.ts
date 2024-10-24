import { Result } from "@/lib/result"
import { columnsRepository } from "@/lib/workflow/columns/columns-repository"

export interface CreateSubtaskRequest {
  columnId: string
  taskId: string
  text: string
}

export async function createSubtask(
  props: CreateSubtaskRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found")
  }

  const task = column.FindTask(props.taskId)

  if (!task) {
    throw Result.Fail("Task not found")
  }

  task.AddSubtask(props.text)

  await columnsRepository().save(column)
}
