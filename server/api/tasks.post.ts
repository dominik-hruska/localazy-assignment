import { createError, readBody } from "h3";
import { TaskStatus } from "~/enums/task-status";
import { TASK_TITLE_MAX_LENGTH } from "#shared/constants/tasks";
import { createTask } from "~~/server/utils/tasks-store";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    title?: string;
    status?: TaskStatus;
  }>(event);

  const title = typeof body.title === "string" ? body.title.trim() : "";

  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title cannot be empty.",
    });
  }

  if (title.length > TASK_TITLE_MAX_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: `Title must be ${TASK_TITLE_MAX_LENGTH} characters or fewer.`,
    });
  }

  const status = Object.values(TaskStatus).includes(body.status as TaskStatus)
    ? (body.status as TaskStatus)
    : TaskStatus.Todo;

  return createTask(title, status);
});
