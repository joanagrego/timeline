import dayjs from 'dayjs';

export function assignLanes(items) {
  const sorted = [...items].sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
  const lanes = [];

  sorted.forEach(item => {
    let placed = false;

    for (let i = 0; i < lanes.length; i++) {
      const last = lanes[i][lanes[i].length - 1];
      if (dayjs(last.end).isBefore(dayjs(item.start))) {
        lanes[i].push(item);
        item.lane = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      lanes.push([item]);
      item.lane = lanes.length - 1;
    }
  });

  return sorted;
}
