import { getTasks } from "~~/server/utils/tasks-store";

export default defineEventHandler(async () => {
  return getTasks();
});
