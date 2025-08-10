/**
 * Calendar 组件 - 显示和管理日历视图的待办事项
 * 
 * 功能：
 * 1. 以时间网格形式显示待办事项
 * 2. 支持拖拽调整事件时间
 * 3. 支持调整事件持续时间
 * 4. 支持从TodoList拖拽待办事项到日历
 * 
 * 依赖：
 * - FullCalendar 时间网格视图
 * - interactionPlugin 用于拖拽交互
 */
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventInput } from '@fullcalendar/core'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

/**
 * 日历组件属性定义
 */
interface CalendarProps {
  onEventDrop: (event: any) => void  // 事件拖拽回调
  onEventResize: (event: any) => void // 事件调整大小回调
}

/**
 * 日历组件
 * @param onEventDrop 处理事件拖拽的回调函数
 * @param onEventResize 处理事件调整大小的回调函数
 * @returns 日历视图JSX元素
 */
export const Calendar = ({ onEventDrop, onEventResize }: CalendarProps) => {
  const [events, setEvents] = useState<EventInput[]>([])

  // 初始化获取事件数据
  useEffect(() => {
    fetchEvents()
  }, [])

  /**
   * 从API获取日历事件数据
   * 转换待办事项为FullCalendar事件格式
   */
  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/todo/schedule')
      setEvents(response.data.map((todo: any) => ({
        id: todo.id.toString(),
        title: todo.title,
        start: todo.startTime,
        end: todo.endTime,
        color: todo.completed ? '#d1d5db' : '#3b82f6', // 已完成显示灰色
        extendedProps: {
          description: todo.description,
          completed: todo.completed
        }
      })))
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  /**
   * 处理事件拖拽
   * @param info FullCalendar拖拽事件信息
   */
  const handleEventDrop = (info: any) => {
    onEventDrop(info.event)
  }

  /**
   * 处理事件大小调整
   * @param info FullCalendar调整大小事件信息
   */
  const handleEventResize = (info: any) => {
    onEventResize(info.event)
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md overflow-hidden">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        slotMinTime="08:00:00" // 最早显示时间
        slotMaxTime="22:00:00" // 最晚显示时间
        slotDuration="00:30:00" // 时间间隔30分钟
        allDaySlot={false} // 不显示全天事件
        drop={(info) => {
          // 处理从TodoList拖拽过来的待办事项
          const todoData = info.draggedEl.dataset.todo;
          if (!todoData) return;
          
          try {
            const todo = JSON.parse(todoData);
            const duration = todo.duration || 60; // 默认1小时
            const newEvent = {
              id: todo.id.toString(),
              title: todo.title,
              start: info.date,
              end: new Date(info.date.getTime() + duration * 60 * 1000),
              color: '#3b82f6', // 蓝色表示未完成
              extendedProps: {
                description: todo.description || '',
                completed: false
              }
            };
            setEvents([...events, newEvent]);
            onEventDrop(newEvent);
          } catch (error) {
            console.error('Error parsing todo data:', error);
          }
        }}
      />
    </div>
  )
}
