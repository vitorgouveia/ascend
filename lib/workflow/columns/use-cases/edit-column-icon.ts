import { Result } from "@/lib/result"
import { columnsRepository } from "../columns-repository"

export interface EditColumnIconRequest {
  columnId: string
  icon: string
}

export async function editColumnIcon(
  props: EditColumnIconRequest
): Promise<void> {
  const column = await columnsRepository().retrieve(props.columnId)

  if (!column) {
    throw Result.Fail("Column not found!")
  }

  column.EditIcon(props.icon)

  await columnsRepository().save(column)
}
