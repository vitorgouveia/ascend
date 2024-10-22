import { Column } from "../column"
import { columnsRepository } from "../columns-repository"

export interface CreateColumnRequest {
  title: string
  icon: string
}

export async function createColumn(props: CreateColumnRequest): Promise<void> {
  const column = Column.Create({
    title: props.title,
    icon: props.icon,
  })

  await columnsRepository().save(column)
}
