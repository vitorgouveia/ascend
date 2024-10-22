"use client"

import { useState } from "react"
import { XIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { cn } from "@/components/utils"

import { SubtaskStatus } from "@/lib/workflow/subtasks/subtask"

export type SubTaskProps = {
  id: string
  text: string
  status: SubtaskStatus
  reason: string | null
}

export function Subtask({ text, status, reason }: SubTaskProps) {
  const [blocked, setBlocked] = useState<boolean>(status === "blocked")
  const [checked, setChecked] = useState<boolean>(status === "done")

  async function handleChecked(update: boolean) {
    setChecked(update)
    setBlocked(false)

    try {
      // await api.patch(`/subtasks/${id}`, {
      //   status: update ? 'done' : 'to do',
      //   reason: null
      // })
    } catch {
      setChecked(!update)
    }
  }

  async function handleDeleteSubTask() {
    // await deleteSubTask(id)
  }

  return (
    <div className="group grid min-h-6 grid-cols-5 items-center gap-2">
      <Label
        className={cn(
          "col-span-4 flex flex-col items-center gap-2 rounded-sm p-1.5 transition focus-within:bg-white/10 hover:bg-white/10"
        )}
      >
        <div className="flex w-full items-start gap-2">
          <Checkbox
            data-disabled={blocked}
            checked={checked || blocked}
            onCheckedChange={handleChecked}
          />

          <span
            className={cn(
              blocked ? "text-red-500" : "text-muted-foreground",
              checked && "striketrough-animated opacity-50"
            )}
          >
            {text}
          </span>
        </div>

        {blocked && (
          <span className="w-full pl-6 text-sm text-destructive">{reason}</span>
        )}
      </Label>

      <Button
        onClick={handleDeleteSubTask}
        variant="ghost"
        size="icon"
        className="col-span-1 !h-max !w-max !p-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100"
      >
        <XIcon size={12} className="text-muted-foreground" />
      </Button>
    </div>
  )
}
