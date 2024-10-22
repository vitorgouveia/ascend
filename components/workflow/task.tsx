"use client"

import { TrashIcon, BanIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// import { SubTask, SubTaskProps } from "@/components/sub-task"

import { cn } from "@/components/utils"
import { Subtask as ISubtask } from "@/lib/workflow/subtasks/subtask"

import { Subtask } from "@/components/workflow/subtask"
// import { workflow } from "./context"
import { useState } from "react"
// import { createSubTask } from "@/components/actions/create-sub-task"
// import { blockTask } from "@/components/actions/block-task"

function TaskContents({
  // id,
  // columnId,
  title: taskTitle,
  subtasks,
}: {
  id: string
  columnId: string
  title: string
  subtasks: ISubtask[]
}) {
  const [title, setTitle] = useState(taskTitle)
  // const { editTaskTitle } = workflow()

  async function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.currentTarget.value)
    // await editTaskTitle({
    //   columnId,
    //   taskId: id,
    //   title: event.currentTarget.value,
    // })
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-t-lg border p-3">
      <Input
        placeholder="Placeholder Title"
        className="!h-auto p-2 text-sm font-semibold focus-visible:border-input"
        value={title}
        onChange={handleTitleChange}
      />

      {subtasks.map((subtask) => (
        <Subtask
          key={subtask.id}
          id={subtask.id}
          text={subtask.text}
          status={subtask.status}
          reason={subtask.reason}
        />
      ))}

      {/* <form action={createSubTask.bind(null, id, columnId)}>
        <Button variant='outline' size='sm'>Adicionar</Button>
      </form> */}
    </div>
  )
}

function TaskUtils({}: { id: string; columnId: string }) {
  // const { deleteTask, blockTask } = workflow()

  async function handleDeleteTask() {
    // await deleteTask(columnId, id)
  }

  async function handleBlockTask() {
    // await blockTask({
    //   columnId,
    //   taskId: id,
    //   reason: "test block for task",
    // })
  }

  return (
    <div className="flex items-center justify-between rounded-b-lg border border-t-0 bg-[#1a1a1a] p-3 text-muted-foreground">
      <p className="shrink-0 text-sm">1h 10m</p>

      <div className="flex items-center gap-3">
        <Button
          className="h-8 w-8 opacity-0 transition-opacity duration-500 focus-within:opacity-100 group-hover/utils:opacity-100"
          onClick={handleDeleteTask}
          variant="ghost"
          size="icon"
        >
          <TrashIcon size={14} />
        </Button>

        <Button
          className="h-8 w-8 opacity-0 transition-opacity duration-500 focus-within:opacity-100 group-hover/utils:opacity-100"
          onClick={handleBlockTask}
          variant="ghost"
          size="icon"
        >
          <BanIcon size={14} />
        </Button>
      </div>
    </div>
  )
}

export function Task({
  id,
  columnId,
  title,
  subtasks,
}: {
  id: string
  columnId: string
  title: string
  subtasks: ISubtask[]
}) {
  // const { activeTaskId } = useTimer()

  // const active = activeTaskId === id
  // const active = false

  return (
    <div className={cn("group/utils", "flex w-full flex-col")}>
      <TaskContents
        columnId={columnId}
        id={id}
        title={title}
        subtasks={subtasks}
      />

      <TaskUtils columnId={columnId} id={id} />
    </div>
  )
}
