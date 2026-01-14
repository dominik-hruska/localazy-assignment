import { resetTasks } from "~~/server/utils/tasks-store";

export default defineEventHandler(async () => {
  return resetTasks();
});
