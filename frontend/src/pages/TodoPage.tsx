import { Calendar } from '../components/Calendar';
import { TodoList } from '../components/TodoList';

export const TodoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-start">
      {/* TodoList */}
      <div className="w-1/4 pr-4">
        <TodoList />
      </div>

      {/* Calendar */}
      <div className="w-3/4 pl-4">
        <Calendar />
      </div>
    </div>
  );
};