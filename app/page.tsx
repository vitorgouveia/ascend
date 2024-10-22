"use client"

import { Fragment } from "react"

import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable"

import { Column } from "@/components/workflow/column"
import { workflow } from "@/components/workflow/context"

export default function Home() {
  const { columns } = workflow()

  // const createColumn = useCallback(async () => {
  //   await columns.create({
  //     title: "hello world",
  //     icon: "🌍",
  //   })

  //   const query = `[data-columns-list] [data-panel]:last-child [data-column-header] strong`

  //   const title = document.querySelector<HTMLElement>(query)

  //   if (!title) return

  //   title.focus()

  //   const range = document.createRange()
  //   range.selectNodeContents(title)
  //   range.collapse(false)

  //   const selection = window.getSelection()
  //   selection?.removeAllRanges()
  //   selection?.addRange(range)
  // }, [columns])

  return (
    <main className="flex h-screen w-screen">
      {/* <button onClick={createColumn}>create shit</button> */}

      <ResizablePanelGroup direction="horizontal" data-columns-list>
        {columns.list.map((column, index, arr) => (
          <Fragment key={column.id}>
            <Column
              id={column.id}
              title={column.title}
              icon={column.icon}
              tasks={column.tasks}
            />
            {index < arr.length - 1 && <ResizableHandle withHandle />}
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </main>
  )
}
