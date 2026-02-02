import { CheckCircle2, Circle, Trash2, Edit } from 'lucide-react';
import { Todo } from '../../types';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onModify: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onModify }) => (
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200">
        <div className="flex items-center gap-4 flex-1">
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
