export type SubtaskStatus = "to do" | "blocked" | "done"

export interface SubtaskProps {
  id: string
  taskId: string

  status: SubtaskStatus
  text: string
  reason: string | null
}

export class Subtask {
  get id() {
    return this.props.id
  }

  get taskId() {
    return this.props.taskId
  }

  get status() {
    return this.props.status
  }

  get text() {
    return this.props.text
  }

  get reason() {
    return this.props.reason
  }

  private constructor(private props: SubtaskProps) {}

  public static Create(props: SubtaskProps) {
    return new Subtask(props)
  }

  public Block(reason: string) {
    this.props.status = "blocked"
    this.props.reason = reason
  }
}
