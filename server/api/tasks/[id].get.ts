import { getRouterParam, createError } from "h3";
import { getTaskById } from "~~/server/utils/tasks-store";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = Number(idParam);

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task id",
    });
  }

  const task = await getTaskById(id);

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return task;
});
