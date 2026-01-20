import { useState } from 'react';

interface group {
    id: number;
    name: string;
    description: string;
}

interface Todo {
    id: number;
    group: group;
    title: string;
    isCompleted: boolean;
    createdAt: Date;
    deadline: Date;
}

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
