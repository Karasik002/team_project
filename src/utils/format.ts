import { DateTime } from "luxon";

export const formatDate = (isoDate?: string) =>
  isoDate ? DateTime.fromISO(isoDate).toFormat("dd LLL yyyy") : "—";

export const formatTimeLeft = (isoDate?: string) => {
  if (!isoDate) return "Немає даних";
  const expires = DateTime.fromISO(isoDate);
  if (!expires.isValid) return "Невідомо";

  const diff = expires.diff(DateTime.now(), ["days", "hours"]);
  if (diff.days < 0) return "Прострочено";
  if (diff.days < 1) return `Менше доби (${Math.floor(diff.hours)} год)`;
  return `${Math.ceil(diff.days)} дн.`;
};

export const formatDuration = (minutes: number) => `${minutes} хв`;

export const difficultyLabel = {
  easy: "Легко",
  medium: "Середньо",
  hard: "Складно"
} as const;

export const fitnessGoalLabel = {
  maintain: "Підтримка ваги",
  lose_weight: "Схуднення",
  gain_muscle: "Нарощення м'язів",
  improve_endurance: "Витривалість"
} as const;
