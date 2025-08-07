import dayjs from "dayjs";

export const calculateDateRange = (items) => {
  if (!items || items.length === 0) {
    return {
      start: dayjs().subtract(1, "month"),
      end: dayjs().add(1, "month"),
    };
  }
  const dates = items.flatMap((item) => [dayjs(item.start), dayjs(item.end)]);

  const sorted = dates.sort((a, b) => a - b);

  return {
    start: sorted[0].subtract(7, "day"),
    end: sorted[sorted.length - 1].add(7, "day"),
  };
};
