import { Result } from "@/lib/result"
import { Subtask } from "@/lib/workflow/subtasks/subtask"

export type TaskStatus = "to do" | "blocked"

export interface TaskProps {
  id: string
  columnId: string

  title: string
  status: TaskStatus

  reason?: string

  subtasks: Subtask[]
}

interface CreateTask {
  id?: string
  columnId: string

  title: string
  status?: TaskStatus
  reason?: string

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

  private set title(value: string) {
    if (value.length > 50) {
      throw Result.Fail("Title must have a maximum of 50 characters.")
    }

    this.props.title = value
  }

  get status() {
    return this.props.status
  }

  private set status(newStatus) {
    this.props.status = newStatus
  }

  get reason() {
    return this.props.reason
  }

  private set reason(text) {
    this.props.reason = text
  }

  get subtasks() {
    return this.props.subtasks
  }

  private set subtasks(value: Subtask[]) {
    this.props.subtasks = value
  }

  private constructor(private props: TaskProps) {}

  public static Create(props: CreateTask) {
    return new Task({
      id: props.id || crypto.randomUUID(),
      columnId: props.columnId,
      status: props.status || "to do",
      title: props.title,
      subtasks: props.subtasks || [],
      reason: props.reason,
    })
  }

  public EditTitle(title: string) {
    this.title = title
  }

  public Block(reason: string) {
    this.reason = reason
    this.status = "blocked"
  }
}
