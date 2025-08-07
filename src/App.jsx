import { useState } from "react";
import TimelineHeader from "./components/TimelineHeader/TimelineHeader";
import TimelineItem from "./components/TimelineItem/TimelineItem";
import "./App.css";
import dayjs from "dayjs";
import { useTimeline } from "./context/TimelineContex";

export default function App() {
  const { itemsWithLanes, timelineStart, timelineEnd, totalDays, editItem } =
    useTimeline();

  const [zoom, setZoom] = useState(1);

  const handleZoom = (direction) => {
    setZoom((prev) => {
      const newZoom = direction === "in" ? prev * 1.2 : prev / 1.2;
      return Math.min(Math.max(newZoom, 0.5), 3);
    });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Project Timeline</h2>
        <div className="zoom-controls">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleZoom("out")}
            disabled={zoom <= 0.5}
          >
            -
          </button>
          <span className="mx-2">{Math.round(zoom * 100)}%</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleZoom("in")}
            disabled={zoom >= 3}
          >
            +
          </button>
        </div>
      </div>

      <div className="timeline-zoom-container">
        <div
          className="timeline-content"
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: "top left",
            width: `${100/zoom}%`
          }}
        >
          <TimelineHeader start={timelineStart} end={timelineEnd} zoom={zoom} />

          <div className="timeline-body">
            {itemsWithLanes.map((item) => {
              const startOffset = dayjs(item.start).diff(timelineStart, "day");
              const duration =
                dayjs(item.end).diff(dayjs(item.start), "day") + 1;
              const left = Math.max(0, (startOffset / totalDays) * 100);
              const width = Math.min(100, (duration / totalDays) * 100);

              return (
                <TimelineItem
                  key={item.id}
                  item={item}
                  left={left}
                  width={width}
                  onEdit={editItem}
                  zoom={zoom}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}