export const hash = (input: string) => {
  return [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

export const pick = <T>(list: T[], seed: number) => {
  const index = Math.abs(seed) % list.length;
  const picked = list[index];
  if (picked === undefined) {
    throw new Error("Cannot pick from an empty list.");
  }
  return picked;
};

export const pickMany = <T>(list: T[], count: number, seed: number) => {
  const pool = [...list];
  const result: T[] = [];
  let index = Math.abs(seed);

  while (pool.length > 0 && result.length < count) {
    index = (index + 3) % pool.length;
    const picked = pool.splice(index, 1)[0];
    if (picked === undefined) break;
    result.push(picked);
  }

  return result;
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const addDays = (date: Date, days: number) => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

export const getFocus = (title: string) => {
  const lower = title.toLowerCase();

  if (lower.includes("release")) return "Release readiness";
  if (lower.includes("bug")) return "Stability improvements";
  if (lower.includes("doc")) return "Documentation rollout";

  return "Delivery planning";
};
