import { Command, Query } from "@/lib/cqrs"
import { Result } from "@/lib/result"
import { uuid } from "@/lib/uuid"

import { Task } from "@/lib/workflow/tasks/task"

export interface ColumnProps {
  id: string

  title: string
  icon: string

  tasks: Task[]
}

export interface CreateColumn {
  id?: string

  title: string
  icon: string

  tasks?: Task[]
}

export class Column {
  get id() {
    return this.props.id
  }

  get title() {
    return this.props.title
  }

  private set title(title: string) {
    if (title.length > 20) {
      throw Result.Fail("Title must have a maximum of 20 characters.")
    }

    this.props.title = title
  }

  get icon() {
    return this.props.icon
  }

  private set icon(icon: string) {
    if (icon.length > 15) {
      throw Result.Fail("Only emojis are allowed as icons.")
    }

    this.props.icon = icon
  }

  get tasks() {
    return this.props.tasks
  }

  private set tasks(value) {
    this.props.tasks = value
  }

  private constructor(private props: ColumnProps) {}

  public static Create(props: CreateColumn) {
    return new Column({
      id: props?.id || uuid(),
      title: props.title,
      icon: props.icon,
      tasks: props?.tasks || [],
    })
  }

  public EditTitle(title: string): Command {
    this.title = title
  }

  public EditIcon(icon: string): Command {
    this.icon = icon
  }

  public AddTask({ title }: { title: string }): Command {
    const task = Task.Create({
      columnId: this.id,
      title,
    })

    this.tasks.push(task)
  }

  public EditTaskTitle(taskId: string, title: string): Command {
    const task = this.tasks.find((task) => task.id === taskId)

    if (!task) {
      throw Result.Fail("Task not found!")
    }

    task.EditTitle(title)
  }

  public BlockTask(taskId: string, reason: string): Command {
    const task = this.tasks.find((task) => task.id === taskId)

    if (!task) {
      throw Result.Fail("Task not found!")
    }

    task.Block(reason)
  }

  public RemoveTask(taskId: string): Command {
    this.tasks = this.tasks.filter((task) => task.id !== taskId)
  }

  public FindTask(taskId: string): Query<Task | null> {
    return this.tasks.find((task) => task.id === taskId) || null
  }
}
