import { Result } from "@/lib/result"
import { Subtask } from "@/lib/workflow/subtasks/subtask"

export type TaskStatus = "to do" | "blocked"

export interface TaskProps {
  id: string
  columnId: string

  title: string
  status: TaskStatus

  subtasks: Subtask[]
}

interface CreateTask {
  id?: string
  columnId: string

  title: string
  status?: TaskStatus

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

  get status(): TaskStatus {
    return this.props.subtasks.find((s) => s.status === "blocked")
      ? "blocked"
      : "to do"
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
    })
  }

  public AddSubtask(text: string) {
    const subtask = Subtask.Create({
      taskId: this.id,
      text,
    })

    this.subtasks.push(subtask)
  }

  public EditTitle(title: string) {
    this.title = title
  }

  public Block(reason: string) {
    const subtask = this.subtasks.find((sub) => sub.status === "to do")

    if (!subtask) {
      throw Result.Fail("No subtasks to block.")
    }

    subtask.Block(reason)
  }

  public Unblock() {
    const subtask = this.subtasks.find((sub) => sub.status === "blocked")

    if (!subtask) {
      throw Result.Fail("No subtasks to unblock.")
    }

    subtask.Unblock()
  }

  public EditSubtaskReason(subtaskId: string, reason: string) {
    const subtask = this.subtasks.find((sub) => sub.id === subtaskId)

    if (!subtask) {
      throw Result.Fail("Subtask not found.")
    }

    subtask.EditReason(reason)
  }

  public EditSubtaskText(subtaskId: string, text: string) {
    const subtask = this.subtasks.find((sub) => sub.id === subtaskId)

    if (!subtask) {
      throw Result.Fail("Subtask not found.")
    }

    subtask.EditText(text)
  }

  public CheckSubtask(subtaskId: string) {
    const subtask = this.subtasks.find((sub) => sub.id === subtaskId)

    if (!subtask) {
      throw Result.Fail("Subtask not found.")
    }

    subtask.Check()
  }

  public UncheckSubtask(subtaskId: string) {
    const subtask = this.subtasks.find((sub) => sub.id === subtaskId)

    if (!subtask) {
      throw Result.Fail("Subtask not found.")
    }

    subtask.Uncheck()
  }

  public RemoveSubtask(subtaskId: string) {
    this.subtasks = this.subtasks.filter((s) => s.id !== subtaskId)
  }
}
