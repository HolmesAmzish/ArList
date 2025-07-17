import { useState, useEffect } from "react";

// Define the data structure for a Todo item
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  scheduled?: boolean;
  startTime?: string;
  endTime?: string;
  duration?: number;
  createdAt?: string;
}

interface TodoPage {
  content: Todo[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

interface TodoListProps {
  onSelect: (todo: Todo) => void;
}

export const TodoList = ({ onSelect }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // assign the variable of pagintion, initialize pagination state
  const [page, setPage] = useState(0); // Current page, 0-indexed
  const [size, setSize] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages from backend

  useEffect(() => {
    fetchTodos();
  }, [page, size]); // Fetch todos whenever page or size changes

  /**
   * Fetches the list of todos from the API
   */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todo/all?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos: ${response.status} ${response.statusText}`
        );
      }
      const data: TodoPage = await response.json(); // Data is of type TodoPage
      setTodos(data.content); // CORRECT: Assigns the array from 'content' to 'todos' state
      setTotalPages(data.totalPages);
      // ... (rest of your function)
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]); // Important: Ensure it's an empty array on error
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const response = await fetch(`/api/todo/toggleComplete/${id}`, {
        method: "POST",
      });

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Error completing todo:", error);
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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Todo List</h1>

      {/* Adding a new todo */}
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

      {/* Display the list of todos */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer ${
              todo.completed ? "bg-gray-50" : "bg-white"
            } ${
              selectedId === todo.id ? "ring-2 ring-blue-500" : ""
            }`}
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
            <span
              className={`flex-grow ${
                todo.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Delete todo"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))} // Go to previous page, not below 0
          disabled={page === 0} // Disable if currently on the first page
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {/* Display current page (1-indexed for user) and total pages */}
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)} // Go to next page
          disabled={page >= totalPages - 1} // Disable if currently on the last page
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
