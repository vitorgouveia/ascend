"use client"

import { useEffect, useRef, useState } from "react"
import { CheckIcon, PencilIcon, XIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { cn } from "@/components/utils"

import { SubtaskStatus } from "@/lib/workflow/subtasks/subtask"
import { workflow } from "./context"
import { Input } from "../ui/input"
import { useDebouncedCallback } from "use-debounce"

// https://dtang.dev/using-content-editable-in-react/
function EditableReason({
  initialText,
  onUpdate,
}: {
  initialText: string
  onUpdate: (reason: string) => Promise<void>
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current?.textContent !== initialText) {
      ref.current!.value = initialText
    }
  })

  return (
    <div className="w-full pl-6">
      <Input
        placeholder="Put the blocking reason here..."
        className="!h-auto w-full p-1 text-sm text-red-500/60 placeholder:text-muted-foreground/50 focus-visible:border-input"
        ref={ref}
        onChange={(event) => onUpdate(event.currentTarget.value)}
      />
    </div>
  )
}

function EditableText({
  initialText,
  focused,
  onUpdate,
}: {
  initialText: string
  focused: boolean
  onUpdate: (text: string) => Promise<void>
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current?.textContent !== initialText) {
      ref.current!.textContent = initialText
    }

    if (!focused && ref.current) {
      ref.current.contentEditable = "false"
    }

    if (focused && ref.current) {
      ref.current.contentEditable = "plaintext-only"
      ref.current?.focus()

      queueMicrotask(() => {
        const range = document.createRange()
        const selection = window.getSelection()

        range.selectNodeContents(ref.current!)
        range.collapse(false)

        selection?.removeAllRanges()
        selection?.addRange(range)
      })
    }
  })

  return (
    <span
      ref={ref}
      onInput={(event) => onUpdate(event.currentTarget.textContent!)}
      suppressContentEditableWarning
      className="!outline-0"
    />
  )
}

export type SubTaskProps = {
  id: string
  taskId: string
  columnId: string

  text: string
  status: SubtaskStatus
  reason: string | null
}

export function Subtask({
  id,
  taskId,
  columnId,
  text,
  status,
  reason,
}: SubTaskProps) {
  const blocked = status === "blocked"
  const checked = status === "done"
  const [draftMode, setDraftMode] = useState(false)
  const { subtasks } = workflow()

  const debouncedReasonUpdate = useDebouncedCallback(async (reason: string) => {
    await subtasks.editReason({
      columnId,
      taskId,
      subtaskId: id,
      reason,
    })
  }, 500)

  const debouncedTextUpdate = useDebouncedCallback(async (text: string) => {
    await subtasks.editText({
      columnId,
      taskId,
      subtaskId: id,
      text,
    })
  }, 500)

  async function handleChecked(update: boolean) {
    if (update) {
      await subtasks.check({
        columnId,
        taskId,
        subtaskId: id,
      })
      return
    }

    // uncheck
    await subtasks.uncheck({
      columnId,
      taskId,
      subtaskId: id,
    })

    // setChecked(update)
    // setBlocked(false)
    // try {
    //   // await api.patch(`/subtasks/${id}`, {
    //   //   status: update ? 'done' : 'to do',
    //   //   reason: null
    //   // })
    // } catch {
    //   setChecked(!update)
    // }
  }

  async function handleEditSubtask() {
    setDraftMode((v) => !v)
  }

  async function handleDeleteSubtask() {
    await subtasks.delete({
      columnId,
      taskId,
      subtaskId: id,
    })
  }

  return (
    <div className="group grid min-h-6 grid-cols-8 items-start gap-2">
      <div className={cn("col-span-6 flex w-full flex-col items-start gap-1")}>
        <Label
          className={cn(
            "flex h-7 w-full items-center gap-2 rounded-sm border border-dashed border-transparent p-1.5 transition hover:bg-white/10",
            draftMode
              ? "border-white/20 focus-within:!bg-transparent"
              : "focus-within:bg-white/10"
          )}
        >
          <Checkbox
            data-disabled={blocked}
            checked={checked || blocked}
            onCheckedChange={handleChecked}
          />

          <p
            className={cn(
              blocked ? "text-red-500" : "text-muted-foreground",
              checked && "striketrough-animated opacity-50"
            )}
          >
            <EditableText
              initialText={text}
              focused={draftMode}
              onUpdate={async (text) => {
                await debouncedTextUpdate(text)
              }}
            />
          </p>
        </Label>

        {blocked && (
          <EditableReason
            initialText={reason || ""}
            onUpdate={async (reason) => {
              await debouncedReasonUpdate(reason)
            }}
          />
        )}
      </div>

      <Button
        onClick={handleEditSubtask}
        variant="ghost"
        size="icon"
        className="col-span-1 !h-max !w-max !p-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
      >
        {draftMode ? (
          <CheckIcon size={12} className="text-muted-foreground" />
        ) : (
          <PencilIcon size={12} className="text-muted-foreground" />
        )}
      </Button>

      <Button
        onClick={handleDeleteSubtask}
        variant="ghost"
        size="icon"
        className="col-span-1 !h-max !w-max !p-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
      >
        <XIcon size={12} className="text-muted-foreground" />
      </Button>
    </div>
  )
}
