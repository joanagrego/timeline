import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import "./TimelineItem.css";
import { useTimeline } from "../../context/TimelineContex";

const TimelineItem = ({ item, left, width }) => {
  const { timelineStart, totalDays, editItem } = useTimeline();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null); // 'start' or 'end'
  const itemRef = useRef(null);
  const contentRef = useRef(null);

  // Handle text size adjustment
  useEffect(() => {
    if (contentRef.current && !isEditing) {
      const element = contentRef.current;
      const parentWidth = element.parentElement.offsetWidth;
      
      let fontSize = 12;
      element.style.fontSize = `${fontSize}px`;
      
      while (element.scrollWidth > parentWidth && fontSize > 8) {
        fontSize -= 0.5;
        element.style.fontSize = `${fontSize}px`;
      }
    }
  }, [width, isEditing, item.name]);

  const handleSave = () => {
    if (editedName.trim()) {
      editItem(item.id, { name: editedName });
    }
    setIsEditing(false);
  };

  const handleResizeStart = (type, e) => {
    e.stopPropagation();
    e.preventDefault();
    setResizeType(type);
    setIsResizing(true);
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchmove', handleResize, { passive: false });
    document.addEventListener('touchend', handleResizeEnd);
  };

  const handleResize = (e) => {
    if (!isResizing) return;
    e.preventDefault();
    
    const clientX = e.clientX || e.touches[0].clientX;
    const timelineBody = itemRef.current.closest('.timeline-body');
    const timelineRect = timelineBody.getBoundingClientRect();
    const positionPercent = Math.min(Math.max(
      ((clientX - timelineRect.left) / timelineRect.width) * 100, 
      100
    ), 0);
    
    const daysFromStart = (positionPercent / 100) * totalDays;
    const newDate = dayjs(timelineStart).add(daysFromStart, 'day').format('YYYY-MM-DD');
    
    if (resizeType === 'start') {
      if (dayjs(newDate).isBefore(item.end)) {
        editItem(item.id, { start: newDate });
      }
    } else {
      if (dayjs(newDate).isAfter(item.start)) {
        editItem(item.id, { end: newDate });
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeType(null);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.removeEventListener('touchmove', handleResize);
    document.removeEventListener('touchend', handleResizeEnd);
  };

  return (
    <div
      ref={itemRef}
      className={`timeline-item ${isResizing ? 'resizing' : ''}`}
      style={{
        left: `${left}%`,
        width: `${width}%`,
        top: `${item.lane * 40}px`,
        minWidth: "60px",
      }}
    >
      {/* Resize handles */}
      <div 
        className="resize-handle resize-handle-left"
        onMouseDown={(e) => handleResizeStart('start', e)}
        onTouchStart={(e) => handleResizeStart('start', e)}
      />
      <div 
        className="resize-handle resize-handle-right"
        onMouseDown={(e) => handleResizeStart('end', e)}
        onTouchStart={(e) => handleResizeStart('end', e)}
      />

      {isEditing ? (
        <input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
          className="timeline-item-input"
          style={{ fontSize: "12px" }}
        />
      ) : (
        <div
          ref={contentRef}
          className="timeline-item-content"
          onDoubleClick={() => setIsEditing(true)}
        >
          <span className="item-name">{item.name}</span>
          <span className="item-dates">
            {dayjs(item.start).format("MMM D")} -{" "}
            {dayjs(item.end).format("MMM D")}
          </span>
        </div>
      )}
    </div>
  );
};

export default TimelineItem;