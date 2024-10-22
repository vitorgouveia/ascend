import { Result } from "@/lib/result"
import { columnsRepository } from "../columns-repository"

export interface EditColumnTitleRequest {
  columnId: string
  title: string
}

export async function editColumnTitle(
  props: EditColumnTitleRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found!")
  }

  column.EditTitle(props.title)

  await columnsRepository().save(column)
}
