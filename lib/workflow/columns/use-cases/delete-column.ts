import { columnsRepository } from "../columns-repository"

export interface DeleteColumnRequest {
  columnId: string
}

export async function deleteColumn(props: DeleteColumnRequest): Promise<void> {
  await columnsRepository().remove(props.columnId)
}
