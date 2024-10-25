"use client"

import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import dynamic from "next/dynamic"
import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <Spinner />,
})

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Task as ITask } from "@/lib/workflow/tasks/task"
import { workflow } from "./context"

import { ResizablePanel } from "@/components/ui/resizable"
import { Spinner } from "../ui/spinner"
import { Task } from "./task"

// https://dtang.dev/using-content-editable-in-react/
function EditableTitle({
  initialTitle,
  onUpdate,
}: {
  initialTitle: string
  onUpdate: (title: string) => Promise<void>
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current?.textContent !== initialTitle) {
      ref.current!.textContent = initialTitle
    }
  })

  return (
    <strong
      className="rounded-md border border-transparent px-1 text-lg font-bold !outline-none focus-visible:!border-muted"
      contentEditable
      ref={ref}
      onInput={(event) => onUpdate(event.currentTarget.textContent!)}
      suppressContentEditableWarning
    />
  )
}

function EditableIcon({
  icon,
  onUpdate,
}: {
  icon: string
  onUpdate: (icon: string) => Promise<void>
}) {
  const { resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const handleIconUpdate = async ({ emoji }: EmojiClickData) => {
    await onUpdate(emoji)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex aspect-square h-[30px] w-auto items-center justify-center rounded-md p-px text-lg transition hover:bg-muted">
          {icon}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-transparent backdrop-blur-md">
        <EmojiPicker
          open={open}
          theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
          emojiStyle={EmojiStyle.GOOGLE}
          onEmojiClick={handleIconUpdate}
          lazyLoadEmojis
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderTitle({
  id,
  title: columnTitle,
  icon,
}: {
  id: string
  title: string
  icon: string
}) {
  const { columns } = workflow()

  const debouncedTitleUpdate = useDebouncedCallback(async (title) => {
    await columns.editTitle({
      columnId: id,
      title,
    })
  }, 500)

  const iconUpdate = useCallback(
    async (icon: string) => {
      await columns.editIcon({
        columnId: id,
        icon,
      })
    },
    [columns, id]
  )

  return (
    <div data-column-header={id} className="flex items-center gap-3">
      <EditableIcon icon={icon} onUpdate={iconUpdate} />

      <EditableTitle
        initialTitle={columnTitle}
        onUpdate={async (title) => {
          await debouncedTitleUpdate(title)
        }}
      />

      {/* <span className="rounded-full bg-muted px-4 py-0.5 text-sm font-bold">
        3
      </span> */}
    </div>
  )
}

function HeaderActions({ id }: { id: string }) {
  const { columns, tasks } = workflow()

  async function handleCreateTask() {
    await tasks.create({
      columnId: id,
      title: "Placeholder Title",
    })

    toast.success("Task created")
  }

  async function handleDeleteColumn() {
    const controller = new AbortController()

    await columns.delete({
      columnId: id,
    })

    toast.success("Column deleted", {
      action: {
        label: "undo",
        onClick: () => controller.abort(),
      },
    })

    const handler = async () => {
      // await createColumn(deleted)

      controller.signal.removeEventListener("abort", handler)
    }

    controller.signal.addEventListener("abort", handler)
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Button onClick={handleCreateTask} variant="outline" size="icon">
        <PlusIcon size={16} />
      </Button>

      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer bg-destructive/30 text-destructive-foreground hover:!bg-destructive/60">
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all tasks and subtasks inside this
              column.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quit</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteColumn}
              className={buttonVariants({ variant: "destructive" })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ColumnHeader({ children }: { children: ReactNode }) {
  return (
    <header className="flex w-full items-center justify-between">
      {children}
    </header>
  )
}

export interface ColumnDragData {
  column: {
    id: string
    title: string
  }
}

export function Column({
  id,
  title,
  icon,
  tasks,
}: {
  id: string
  title: string
  icon: string
  tasks: Array<ITask>
}) {
  return (
    <ResizablePanel minSize={25}>
      <section className="flex h-full w-full flex-col items-center gap-8 p-8">
        <ColumnHeader>
          <HeaderTitle id={id} icon={icon} title={title} />

          <HeaderActions id={id} />
        </ColumnHeader>

        {tasks.map((task, index) => (
          <Task
            key={task.id}
            columnId={id}
            index={index}
            id={task.id}
            title={task.title}
            status={task.status}
            subtasks={task.subtasks}
          />
        ))}
      </section>
    </ResizablePanel>
  )
}
