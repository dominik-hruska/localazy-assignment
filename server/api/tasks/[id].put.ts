import { getRouterParam, readBody, createError } from "h3";
import { TaskStatus } from "~/enums/task-status";
import { TASK_TITLE_MAX_LENGTH } from "#shared/constants/tasks";
import { updateTask } from "~~/server/utils/tasks-store";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = Number(idParam);

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task id",
    });
  }

  const body = await readBody<{
    title?: string;
    status?: TaskStatus;
  }>(event);

  const patch: { title?: string; status?: TaskStatus } = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();

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

    patch.title = title;
  }

  if (
    body.status &&
    Object.values(TaskStatus).includes(body.status as TaskStatus)
  ) {
    patch.status = body.status;
  }

  const updated = await updateTask(id, patch);

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  await wait(2000);

  return updated;
});
