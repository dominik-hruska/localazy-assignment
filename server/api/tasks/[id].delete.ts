import { getRouterParam, createError } from "h3";
import { deleteTask } from "~~/server/utils/tasks-store";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = Number(idParam);

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task id",
    });
  }

  const deleted = await deleteTask(id);

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return { ok: true };
});
