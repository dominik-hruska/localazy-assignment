export default defineNuxtRouteMiddleware((to) => {
  const rawId = to.params.id;
  const id = Array.isArray(rawId) ? Number(rawId[0]) : Number(rawId);

  if (!Number.isInteger(id)) {
    return navigateTo("/404");
  }

  return undefined;
});
