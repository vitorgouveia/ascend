"use client"

import { useEffect, useRef } from "react"
import { useDebouncedCallback } from "use-debounce"
import { TrashIcon, BanIcon, MinusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/components/utils"

import { workflow } from "@/components/workflow/context"
import { Subtask as ISubtask } from "@/lib/workflow/subtasks/subtask"
import { toast } from "sonner"
import { TaskStatus } from "@/lib/workflow/tasks/task"

// https://dtang.dev/using-content-editable-in-react/
function EditableTitle({
  initialTitle,
  onUpdate,
}: {
  initialTitle: string
  onUpdate: (title: string) => Promise<void>
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current?.textContent !== initialTitle) {
      ref.current!.value = initialTitle
    }
  })

  return (
    <Input
      placeholder="Placeholder Title"
      className="!h-auto p-2 text-sm font-semibold focus-visible:border-input"
      ref={ref}
      onChange={(event) => onUpdate(event.currentTarget.value)}
    />
  )
}

function TaskContents({
  id,
  columnId,
  title: taskTitle,
  // subtasks,
}: {
  id: string
  columnId: string
  title: string
  subtasks: ISubtask[]
}) {
  const { tasks } = workflow()

  const debouncedTitleUpdate = useDebouncedCallback(async (title: string) => {
    await tasks.editTitle({
      taskId: id,
      columnId,
      title,
    })
  }, 500)

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-t-lg border p-3",
        "group-[.blocked]/utils:border-destructive"
      )}
    >
      <EditableTitle
        initialTitle={taskTitle}
        onUpdate={async (title) => {
          await debouncedTitleUpdate(title)
        }}
      />

      {/* {subtasks.map((subtask) => (
        <Subtask
          key={subtask.id}
          id={subtask.id}
          text={subtask.text}
          status={subtask.status}
          reason={subtask.reason}
        />
      ))} */}

      {/* <form action={createSubTask.bind(null, id, columnId)}>
        <Button variant='outline' size='sm'>Adicionar</Button>
      </form> */}
    </div>
  )
}

function TaskUtils({ columnId, id }: { id: string; columnId: string }) {
  const { tasks } = workflow()

  async function handleDeleteTask() {
    await tasks.delete({
      columnId,
      taskId: id,
    })
  }

  async function handleBlockTask() {
    await tasks.block({
      columnId,
      taskId: id,
      reason: "test block for task",
    })

    toast.success("Task blocked")
  }

  async function handleUnblockTask() {}

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-b-lg p-3 text-muted-foreground",
        "border border-t-0 bg-[#1a1a1a]",
        "group-[.blocked]/utils:border-destructive group-[.blocked]/utils:bg-destructive group-[.blocked]/utils:text-destructive-foreground"
      )}
    >
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
          className="h-8 w-8 opacity-0 transition-opacity duration-500 focus-within:opacity-100 group-hover/utils:opacity-100 group-[.blocked]/utils:hidden"
          onClick={handleBlockTask}
          variant="ghost"
          size="icon"
        >
          <BanIcon size={14} />
        </Button>

        <Button
          className="hidden h-8 w-8 opacity-0 transition-opacity duration-500 focus-within:opacity-100 group-hover/utils:opacity-100 group-[.blocked]/utils:flex"
          onClick={handleUnblockTask}
          variant="ghost"
          size="icon"
        >
          <MinusIcon size={14} />
        </Button>
      </div>
    </div>
  )
}

export function Task({
  id,
  columnId,
  title,
  status,
  subtasks,
}: {
  id: string
  columnId: string
  title: string
  status: TaskStatus
  subtasks: ISubtask[]
}) {
  // const { activeTaskId } = useTimer()

  // const active = activeTaskId === id
  // const active = false
  const blocked = status === "blocked"

  return (
    <div
      className={cn(
        "group/utils",
        blocked && "blocked",
        "flex w-full flex-col"
      )}
    >
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
