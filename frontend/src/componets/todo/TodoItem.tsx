import { CheckCircle2, Circle, Trash2, Edit } from 'lucide-react';
import { Todo } from '../../types';

// Helper function to format date and check if deadline is near
const formatDeadline = (deadline: string | null) => {
  if (!deadline) return null;
  
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const timeDiff = deadlineDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Format the date
  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return {
    formattedDate,
    isNear: daysDiff <= 1 && daysDiff >= 0, // Less than or equal to 1 day remaining
    daysDiff
  };
};

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onModify: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onModify }) => {
  const deadlineInfo = formatDeadline(todo.deadline);
  
  return (
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggle(todo.id)}
              className="transition-transform active:scale-90"
            >
              {todo.isCompleted ? (
                  <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={22} />
              ) : (
                  <Circle className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 dark:group-hover:text-indigo-500" size={22} />
              )}
            </button>
            <span className={`text-[15px] transition-all ${todo.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {todo.title}
            </span>
          </div>
          
          {deadlineInfo && (
            <div className="mt-1 ml-10"> {/* Indent to align with title */}
              <span className={`text-xs ${deadlineInfo.isNear ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                Due: {deadlineInfo.formattedDate}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
            <button
                onClick={() => onModify(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
            >
                <Trash2 size={18} />
            </button>
        </div>
    </div>
  );
};
