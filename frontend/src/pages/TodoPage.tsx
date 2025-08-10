import { useState } from 'react';
import { TodoList } from '../components/TodoList';
import { TodoDetail } from '../components/TodoDetail';
import type { Todo } from '../components/TodoList';

export const TodoPage = () => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleTodoSelect = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    setSelectedTodo(updatedTodo);
    setReloadTrigger(prev => prev + 1);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-start justify-center">
      {/* TodoList */}
      <div className="pr-4">
        <TodoList onSelect={handleTodoSelect} reloadTrigger={reloadTrigger}/>
      </div>

      {/* TodoDetail */}
      <div className="px-4">
        <TodoDetail todo={selectedTodo} onUpdate={handleTodoUpdate} />
      </div>

    </div>
  );
};
