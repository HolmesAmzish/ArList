import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventInput } from '@fullcalendar/core'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

export const Calendar = () => {
  const [events, setEvents] = useState<EventInput[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/todo/schedule', {
        params: {
          start: dayjs().startOf('month').format(),
          end: dayjs().endOf('month').format()
        }
      })
      setEvents(response.data.map((todo: any) => ({
        id: todo.id.toString(),
        title: todo.title,
        start: todo.startTime,
        end: todo.endTime,
        color: todo.color,
        extendedProps: {
          description: todo.description,
          completed: todo.completed
        }
      })))
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const handleDateClick = (arg: any) => {
    console.log('Date clicked:', arg.dateStr)
  }

  const handleEventClick = (arg: any) => {
    console.log('Event clicked:', arg.event.title)
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        
        height="auto"  // 保持自动高度
        contentHeight="auto" // 内容高度自动
        aspectRatio={2} // 控制日历的宽高比，值越小越紧凑
        slotMinTime="00:00:00" // 最早显示时间
        slotMaxTime="24:00:00" // 最晚显示时间
        slotDuration="01:00:00" // 时间间隔30分钟
        allDaySlot={true} // 隐藏全天事件栏
        expandRows={true} // 不扩展行高
      />
    </div>
  )
}
