/**
 * TodoList Component
 */
import { useState, useEffect } from "react";

/**
 * 待办事项数据结构
 */
interface Todo {
  id: number;          
  title: string;       
  description?: string;
  completed: boolean;  
  duration?: number;   
}

/**
 * 组件属性定义
 */
interface TodoListProps {
  onSelect: (todo: Todo) => void;  // 选择待办项的回调
  reloadTrigger: number;           // 重新加载触发标志
}

export const TodoList = ({ onSelect, reloadTrigger }: TodoListProps) => {
  // State declarations in consistent order
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todo/all?page=${page}&size=${size}`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Data fetching effect
  useEffect(() => {
    fetchTodos();
  }, [page, size, reloadTrigger]);


  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch("/api/todo/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodo,
          completed: false,
          userId: 1,
        }),
      });

      if (response.ok) {
        setNewTodo("");
        fetchTodos();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleCompleteTodo = async (id: number) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    );
    setTodos(updatedTodos);
    
    const updatedTodo = updatedTodos.find(t => t.id === id);
    if (updatedTodo) {
      onSelect(updatedTodo);
    }

    try {
      await fetch(`/api/todo/toggleComplete/${id}`, {
        method: "POST",
      });
      await fetchTodos();
    } catch (error) {
      console.error("Error completing todo:", error);
      setTodos(todos);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todo/delete/${id}`, {
        method: "POST",
      });

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div id="todo-list-container" className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Todo List</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item flex items-center p-3 border rounded-lg cursor-pointer ${
              todo.completed ? "bg-gray-50" : "bg-white"
            } ${selectedId === todo.id ? "ring-2 ring-blue-500" : ""}`}
            data-todo-id={todo.id}
            onClick={() => {
              setSelectedId(todo.id);
              onSelect(todo);
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleteTodo(todo.id)}
              className="h-5 w-5 text-blue-500 rounded mr-3"
            />
            <span className={`flex-grow ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Delete todo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
