import dayjs from "dayjs";
import "./TimelineHeader.css";

const TimelineHeader = ({ start, end }) => {
  const months = [];
  let current = dayjs(start);

  while (current.isBefore(end)) {
    months.push(current);
    current = current.add(1, "month");
  }

  return (
    <div className="timeline-header">
      {months.map((month) => {
        const daysInMonth = month.daysInMonth();
        const widthPercent = (daysInMonth / 30) * 100;

        return (
          <div
            key={month.format("YYYY-MM")}
            className="timeline-month"
            style={{ flexBasis: `${widthPercent}%` }}
          >
            <div>{month.format("MMM")}</div>
            <div style={{ fontSize: "0.8em", opacity: 0.7 }}>
              {month.format("YYYY")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineHeader;
