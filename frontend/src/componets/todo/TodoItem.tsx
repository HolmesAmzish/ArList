import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import type {Todo} from '../../types';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => (
    <div className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-4 flex-1">
            <button
                onClick={() => onToggle(todo.id)}
                className="transition-transform active:scale-90"
            >
                {todo.isCompleted ? (
                    <CheckCircle2 className="text-emerald-500" size={22} />
                ) : (
                    <Circle className="text-slate-300 group-hover:text-indigo-400" size={22} />
                )}
            </button>
            <span className={`text-[15px] transition-all ${todo.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
        {todo.title}
      </span>
        </div>
        <button
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"
        >
            <Trash2 size={18} />
        </button>
    </div>
);