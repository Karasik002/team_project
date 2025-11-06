const MS_IN_DAY = 24 * 60 * 60 * 1000;

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * MS_IN_DAY);

export const differenceInCalendarDays = (dateLeft: Date, dateRight: Date): number => {
  const startOfLeft = new Date(dateLeft.getFullYear(), dateLeft.getMonth(), dateLeft.getDate());
  const startOfRight = new Date(dateRight.getFullYear(), dateRight.getMonth(), dateRight.getDate());
  return Math.round(
    (startOfLeft.getTime() - startOfRight.getTime()) / MS_IN_DAY
  );
};

export const isBefore = (date: Date, compare: Date): boolean => date.getTime() < compare.getTime();

export const formatRelative = (dateIso: string): string => {
  const date = new Date(dateIso);
  const now = new Date();
  const diffDays = differenceInCalendarDays(date, now);
  if (diffDays === 0) return 'сьогодні';
  if (diffDays === 1) return 'завтра';
  if (diffDays > 1) return `через ${diffDays} дн.`;
  if (diffDays === -1) return 'вчора';
  return `${Math.abs(diffDays)} дн. тому`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} хв`;
  if (mins === 0) return `${hours} год`;
  return `${hours} год ${mins} хв`;
};
