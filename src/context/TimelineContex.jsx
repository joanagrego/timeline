import { createContext, useState, useContext } from "react";
import { assignLanes } from "../utils/assignLanes";
import { calculateDateRange } from "../utils/calculateDateRange";

const TimelineContext = createContext();

export function TimelineProvider({ children, initialItems }) {
  const [items, setItems] = useState(initialItems);

  const itemsWithLanes = assignLanes(items);

  const { start: timelineStart, end: timelineEnd } = calculateDateRange(items);
  const totalDays = timelineEnd.diff(timelineStart, "day");

  const editItem = (id, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addItem = (newItem) => {
    setItems((prev) => [
      ...prev,
      {
        ...newItem,
        id: Math.max(...prev.map((i) => i.id), 0) + 1,
      },
    ]);
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <TimelineContext.Provider
      value={{
        items,
        itemsWithLanes,
        timelineStart,
        timelineEnd,
        totalDays,
        editItem,
        addItem,
        deleteItem,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
