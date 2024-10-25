<a href="#">
  <img
    alt="Ascend logo"
    src=".github/cover.jpg"
  >
</a>

<p align="center">
  <table>
    <tbody>
      <td align="center">
        <img width="800" height="0" /><br>
        <strong>Ascend</strong>
        <img width="800" height="0" /><br>
        ⌛ Non-blocking task management.
        <img width="800" height="0" /><br>
        <i>Version: <a href="https://github.com/vitorgouveia/ascend/releases/tag/v0.1">v0.3</a></i>
        <img width="800" height="0" />
      </td>
    </tbody>
  </table>
</p>

<br />

[Features](#features) <br />
[Tech Stack](#tech-stack)

---

# Features

### Columns

Columns group tasks into a context, each column has it's own context.
For Example: Personal Projects, Work and College.

Columns have an icon and a title, both can be edited.

<img
  src=".github/column-details.gif"
/>

Columns can also be deleted.

> But there's no way to create them back yet.

<img
  src=".github/column-delete.gif"
/>

### Tasks

Tasks group various subtasks together, and represent a chunk of work.

Tasks can be created, deleted, blocked (I'll touch on that later).

Tasks titles can also be edited.

<img
  src=".github/tasks-management.gif"
/>

### Subtasks

Subtasks represent the smallest unit of work.

Subtasks can be created in tasks, checked, unchecked and blocked.

<img
  src=".github/subtask-management.gif"
/>

Blocking a task means that progress dependps on some external person or resource that isn't available now, and if the subtask is blocked we cannot progress on the task itself, forcing a skip to the next available task of that column or the next one.

```mermaid
flowchart TD
  A[Current Task] --> B{Is It Blocked?};
  B -- Yes --> C[Jump to next non-blocked task in column or next column]
  B -- No --> D[Keep working until finished or blocked]
  C ----> E[Enjoy unlimited productivity!]
  D ----> E[Enjoy unlimited productivity!]
```

<img
  src=".github/full-demonstration.gif"
/>

# Tech Stack

- [next.js](https://nextjs.org)
- [tailwind](https://tailwindcss.com)
- [shadcn](https://ui.shadcn.com)
