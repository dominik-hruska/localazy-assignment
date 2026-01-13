# Tasks Dashboard Assignment

We are Localazy, and we're looking for developers who enjoy building clean,
well-structured applications and can work independently.

If you'd like to join our team, this assignment will help us understand how you think,
how you approach problems, and how you write code.

Below is a quick intro to our stack, followed by the task itself.

The frontend part is a `pnpm` monorepo managed with `Turborepo`. Inside the monorepo we
have two main applications and several shared packages. The Product SPA runs on `Vue 3`
with `Vite`, uses `Pinia` for state management, `Tailwind 3` for styling,
and `Vitest` + `Cypress` for testing. The Product Web application is built on `Nuxt 4`
and fetches its content from `Directus CMS`. The entire codebase is written in `TypeScript 5`,
formatted with `Prettier`, linted with `ESLint`, and runs on `Node 22`. Shared packages provide
common UI, utilities, and types across both applications.

---

## Assignment

### Project Preparation

Create a fresh `Nuxt` application using:

```shell
pnpm create nuxt@latest
```

Then install:
- `Tailwind 4`
- `Pinia 3`

You may structure the project however you prefer, but keep the code clean and readable.
Please use `Tailwind` for styling, and design the entire UI according to your best judgement.
You don't need to match any specific design; a simple, clean UI is perfectly fine.

### Feature A: Fetch + Filter + Loading State

Create a JSON-backed mock datastore to persist tasks:

```ts
// server/utils/tasks-store.ts
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
};

const DATA_DIR = join(process.cwd(), 'server', 'data');
const TASKS_FILE = join(DATA_DIR, 'tasks.json');

const SEED_TASKS: Task[] = [
  { id: 1, title: 'Prepare release', status: 'done' },
  { id: 2, title: 'Fix login bug', status: 'in-progress' },
  { id: 3, title: 'Write API docs', status: 'todo' },
];

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(TASKS_FILE);
  } catch {
    await fs.writeFile(TASKS_FILE, JSON.stringify(SEED_TASKS, null, 2), 'utf8');
  }
}

async function readTasks(): Promise<Task[]> {
  await ensureDataFile();
  const raw = await fs.readFile(TASKS_FILE, 'utf8');
  return JSON.parse(raw) as Task[];
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

export async function getTasks(): Promise<Task[]> {
  return readTasks();
}

export async function getTaskById(id: number): Promise<Task | undefined> {
  const tasks = await readTasks();
  return tasks.find((t) => t.id === id);
}

export async function updateTask(
  id: number,
  patch: Partial<Pick<Task, 'title' | 'status'>>,
): Promise<Task | undefined> {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  const updated: Task = { ...tasks[index], ...patch };
  tasks[index] = updated;
  await writeTasks(tasks);
  return updated;
}
```

Create a server route for the list of tasks:

```ts
// server/api/tasks.get.ts
import { getTasks } from '../utils/tasks-store';

export default defineEventHandler(async () => {
  return getTasks();
});
```

Your goal is to implement the `/tasks` page that displays the list of tasks.

Requirements:
- Fetch data using `useAsyncData`
- Allow filtering tasks by status
- Display a loading state while data is being fetched
- Display an empty state if no tasks match the filter
- Implement task-related logic in a way that can be reused elsewhere

### Feature B: Detail Page + Route Param Validation

Create a server route for the task detail:

```ts
// server/api/tasks/[id].get.ts
import { getRouterParam, createError } from 'h3';
import { getTaskById } from '../../utils/tasks-store';

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid task id',
    });
  }

  const task = await getTaskById(id);

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Task not found',
    });
  }

  return task;
});
```

Your goal is to implement the `/tasks/[id]` page that displays a single task.

Requirements:
- Load the task by ID
- If the task does not exist → redirect to `/404`
- Use Nuxt middleware to validate the ID or handle invalid/not-found states

### Feature C: Simple Form + Error Handling

Create a server route to update a task:

```ts
// server/api/tasks/[id].put.ts
import { getRouterParam, readBody, createError } from 'h3';
import { TaskStatus, updateTask } from '../../utils/tasks-store';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid task id',
    });
  }

  const body = await readBody<{
    title?: string;
    status?: TaskStatus;
  }>(event);

  const patch: { title?: string; status?: TaskStatus } = {};

  if (typeof body.title === 'string') {
    patch.title = body.title;
  }

  if (body.status && ['todo', 'in-progress', 'done'].includes(body.status)) {
    patch.status = body.status;
  }

  const updated = await updateTask(id, patch);

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Task not found',
    });
  }

  await wait(2000);

  return updated;
});
```

On the task detail page, extend the UI:

- Add an input for editing the task title
- Add a Save button
- Call PUT `/api/tasks/[id]` when saving
- Show a loading indicator during save
- Show an error state if the update fails

## Submission

Please submit your solution as a public GitHub repository.

Once your repository is ready, send us the GitHub link so we can review your work.

## Additional notes / expectations

You are free to add small improvements or refinements if you believe they make the project
better. We place a strong emphasis on code quality, clarity, maintainability, and independent
decision-making.

We want to see not only that you can complete the assignment, but also how you think about
the problem, structure your code, and make technical decisions without being explicitly
instructed at every step.

This means we value:
- **Clean, readable code** that another developer could immediately follow
- **Consistent structure and naming**, even in a small demo project
- **Separation of concerns** - UI, data fetching, and business logic should not be mixed unnecessarily
- **Predictable UX**: handling loading, error, and empty states thoughtfully
- **Independent architectural choices** - deciding when logic belongs in a store, composable, or component, and being able to justify that decision
- **Attention to detail** - small touches that improve DX or UX are appreciated
- **Self-sufficiency** - the ability to resolve ambiguity, make assumptions, and complete the task without needing step-by-step guidance
