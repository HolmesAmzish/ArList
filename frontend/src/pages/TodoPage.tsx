import { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { TodoList } from '../components/TodoList';
import { TodoDetail } from '../components/TodoDetail';
import type { Todo } from '../components/TodoList';

export const TodoPage = () => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleTodoSelect = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    setSelectedTodo(updatedTodo);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-start">
      {/* TodoList */}
      <div className="w-1/5 pr-4">
        <TodoList onSelect={handleTodoSelect} />
      </div>

      {/* TodoDetail */}
      <div className="w-1/5 px-4">
        <TodoDetail todo={selectedTodo} onUpdate={handleTodoUpdate} />
      </div>

      {/* Calendar */}
      <div className="w-3/5 pl-4">
        <Calendar />
      </div>
    </div>
  );
};
