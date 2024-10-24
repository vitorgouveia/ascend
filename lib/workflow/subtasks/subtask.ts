import { Result } from "@/lib/result"

export type SubtaskStatus = "to do" | "blocked" | "done"

export interface SubtaskProps {
  id: string
  taskId: string

  status: SubtaskStatus
  text: string
  reason: string | null
}

interface CreateSubtask {
  id?: string
  taskId: string

  status?: SubtaskStatus
  text: string
  reason?: string
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

  private set text(value) {
    // treat multi-line
    this.props.text = value
  }

  get reason() {
    return this.props.reason
  }

  private set reason(value) {
    if (this.status !== "blocked") {
      throw Result.Fail("Subtask must be blocked to have a reason.")
    }

    this.props.reason = value
  }

  private constructor(private props: SubtaskProps) {}

  public static Create(props: CreateSubtask) {
    return new Subtask({
      id: props.id || crypto.randomUUID(),
      taskId: props.taskId,
      status: props.status || "to do",
      text: props.text,
      reason: props.reason || null,
    })
  }

  public EditReason(reason: string) {
    this.props.reason = reason
  }

  public EditText(text: string) {
    this.props.text = text
  }

  public Block(reason: string) {
    this.props.status = "blocked"
    this.props.reason = reason
  }

  public Unblock() {
    this.props.status = "to do"
    this.props.reason = null
  }

  public Check() {
    this.props.status = "done"
    this.props.reason = null
  }

  public Uncheck() {
    this.props.status = "to do"
  }
}
