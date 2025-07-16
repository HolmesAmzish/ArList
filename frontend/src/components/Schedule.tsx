import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { DropTargetMonitor, DragSourceMonitor } from "react-dnd";
import dayjs from "dayjs";

interface ScheduledTodo {
  id: number;
  title: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  day: number; // 0-6 (周日到周六)
  date: string; // "YYYY-MM-DD"
}

export const Schedule = ({ 
  scheduledTodos,
  onUpdateTodo
}: {
  scheduledTodos: ScheduledTodo[];
  onUpdateTodo: (id: number, updates: Partial<ScheduledTodo>) => void;
}) => {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dropRef = useRef<HTMLDivElement>(null);

  // 计算任务在时间轴上的位置和高度
  const calculateTaskStyle = (task: ScheduledTodo) => {
    const start = dayjs(task.startTime, "HH:mm");
    const end = dayjs(task.endTime, "HH:mm");
    const duration = end.diff(start, "minute");
    
    const top = start.hour() * 60 + start.minute();
    const height = duration;
    
    return {
      top: `${top}px`,
      height: `${height}px`,
      left: `${task.day * 120}px`,
      width: "120px"
    };
  };

  // 处理任务拖拽
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["SCHEDULED_TODO", "TODO"],
    drop(item: any, monitor: DropTargetMonitor) {
      const offset = monitor.getClientOffset();
      if (!offset || !dropRef.current) return;

      const rect = dropRef.current.getBoundingClientRect();
      const x = offset.x - rect.left;
      const y = offset.y - rect.top;

      const day = Math.floor(x / 120);
      const hour = Math.floor(y / 60);
      const minute = Math.floor((y % 60) / 5) * 5;
      const timeString = `${hour}:${minute.toString().padStart(2, "0")}`;

      if (monitor.getItemType() === "TODO") {
        // 处理从TodoList拖拽过来的新任务
        onUpdateTodo(item.id, {
          title: item.title,
          day,
          startTime: timeString,
          endTime: dayjs(timeString, "HH:mm").add(30, "minute").format("HH:mm"),
          date: dayjs().format("YYYY-MM-DD")
        });
      } else {
        // 处理已安排任务的重新拖拽
        onUpdateTodo(item.id, {
          day,
          startTime: timeString,
          endTime: dayjs(timeString, "HH:mm")
            .add(item.duration, "minute")
            .format("HH:mm")
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div className="relative h-[720px] overflow-auto" ref={dropRef}>
      {/* 时间轴 */}
      <div className="sticky top-0 bg-white z-10 flex">
        <div className="w-12"></div>
        {days.map((day) => (
          <div key={day} className="w-[120px] text-center font-bold p-2 border">
            {day}
          </div>
        ))}
      </div>

      {/* 时间刻度 */}
      {hours.map((hour) => (
        <div key={hour} className="flex">
          <div className="w-12 text-right pr-2 text-sm text-gray-500">
            {hour}:00
          </div>
          {days.map((_, day) => (
            <div 
              key={`${day}-${hour}`}
              className="w-[120px] h-[60px] border"
            ></div>
          ))}
        </div>
      ))}

      {/* 任务项 */}
      {scheduledTodos.map((task) => (
        <TaskItem 
          key={task.id}
          task={task}
          onUpdate={onUpdateTodo}
          style={calculateTaskStyle(task)}
        />
      ))}
    </div>
  );
};

const TaskItem = ({ task, onUpdate, style }: {
  task: ScheduledTodo;
  onUpdate: (id: number, updates: Partial<ScheduledTodo>) => void;
  style: React.CSSProperties;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SCHEDULED_TODO",
    item: { 
      id: task.id,
      duration: dayjs(task.endTime, "HH:mm").diff(
        dayjs(task.startTime, "HH:mm"),
        "minute"
      )
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <div
      ref={dragRef}
      style={{
        ...style,
        position: "absolute",
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: "#93c5fd",
        borderRadius: "4px",
        padding: "4px",
        cursor: "move"
      }}
    >
      {task.title}
      <div className="absolute bottom-0 w-full h-2 cursor-ns-resize"
        onMouseDown={(e) => {
          e.stopPropagation();
          const startY = e.clientY;
          const startDuration = dayjs(task.endTime, "HH:mm").diff(
            dayjs(task.startTime, "HH:mm"),
            "minute"
          );

          const handleMouseMove = (e: MouseEvent) => {
            const diff = e.clientY - startY;
            const newDuration = Math.max(30, startDuration + diff);
            onUpdate(task.id, {
              endTime: dayjs(task.startTime, "HH:mm")
                .add(newDuration, "minute")
                .format("HH:mm")
            });
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
      />
    </div>
  );
};
