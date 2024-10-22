import { Subtask } from "@/lib/workflow/subtasks/subtask"

export interface TaskProps {
  id: string
  columnId: string

  title: string
  status: "to do"

  subtasks: Subtask[]
}

interface TaskCreate {
  id?: string
  columnId: string

  title: string
  status?: "to do"

  subtasks?: Subtask[]
}

export class Task {
  get id() {
    return this.props.id
  }

  get columnId() {
    return this.props.columnId
  }

  get title() {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
  }

  get status() {
    return this.props.status
  }

  get subtasks() {
    return this.props.subtasks
  }

  set subtasks(value: Subtask[]) {
    this.props.subtasks = value
  }

  private constructor(private props: TaskProps) {}

  public static Create(props: TaskCreate) {
    return new Task({
      id: props.id || crypto.randomUUID(),
      columnId: props.columnId,
      status: props.status || "to do",
      title: props.title,
      subtasks: props.subtasks || [],
    })
  }
}
