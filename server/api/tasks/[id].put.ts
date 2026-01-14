import { getRouterParam, readBody, createError } from "h3";
import type { TaskStatus } from "~/types/tasks";
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
    patch.title = body.title;
  }

  if (body.status && ["todo", "in-progress", "done"].includes(body.status)) {
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
