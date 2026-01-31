import React, { useState, useEffect } from 'react';
import { Sidebar } from '../componets/todo/Sidebar.tsx';
import { TodoItem } from '../componets/todo/TodoItem.tsx';
import { EditTodoModal } from '../componets/todo/EditTodoModal.tsx';
import { Plus, LayoutList } from 'lucide-react';
import type {Group, Todo, TodoCreateRequest} from '../types.ts';
import { groupApi, todoApi } from '../api.ts';

export const TodoPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [activeId, setActiveId] = useState<string | number>('all');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [groupsData, todosData] = await Promise.all([
                groupApi.getAllGroups(),
                todoApi.getAllTodos(0, 1000) // Load all todos
            ]);
            setGroups(groupsData);
            setTodos(todosData.content);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGroup = async () => {
        const name = prompt('Enter group name:');
        if (!name?.trim()) return;

        try {
            await groupApi.addGroup({ name, description: '' });
            await loadData(); // Reload groups
        } catch (error) {
            console.error('Failed to add group:', error);
        }
    };

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Construct the request body
        const todoData: TodoCreateRequest = {
            title: inputValue,
            description: ''
        };
        if (typeof activeId === 'number') {
            todoData.group = { id: activeId };
        }

        try {
            await todoApi.addTodo(todoData);
            setInputValue('');
            await loadData(); // Reload todos
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const handleToggleTodo = async (id: number) => {
        try {
            await todoApi.toggleCompleteTodo(id);
            await loadData(); // Reload todos
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    // const handleDeleteTodo = async (id: number) => {
    //     setTodos(prevState => prevState.filter((item) => item.id !== id));
    //     try {
    //         await todoApi.deleteTodo(id);
    //     } catch (error) {
    //         console.error('Failed to delete todo:', error);
    //         await loadData(); // Reload todos
    //         alert("Delete failed, reverting...");
    //     }
    // };

    const handleDeleteTodo = async (id: number) => {
        setTodos(prevState => prevState.filter((item) => item.id !== id));
        try {
            await todoApi.deleteTodo(id);
            await loadData(); // Reload todos
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    const handleModifyTodo = (id: number) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            setEditingTodo(todo);
            setIsModalOpen(true);
        }
    };

    const handleSaveTodo = async (updatedTodo: Partial<Todo>) => {
        try {
            await todoApi.updateTodo(updatedTodo);
            await loadData(); // Reload todos
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    const activeGroup = groups.find(g => g.id === activeId);
    const displayTodos = activeId === 'all' ? todos : todos.filter(t => t.group?.id === activeId);

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar
                groups={groups}
                activeId={activeId}
                onSelect={setActiveId}
                onAddGroup={handleAddGroup}
            />

            <main className="flex-1 flex flex-col bg-slate-50/50">
                <header className="h-16 px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <LayoutList className="text-indigo-600" size={20} />
                        <h1 className="text-lg font-bold text-slate-800">
                            {activeId === 'all' ? 'All Tasks' : activeGroup?.name}
                        </h1>
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
              {displayTodos.length}
            </span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6">

                        <form onSubmit={handleAddTodo} className="relative group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={
                                    activeId === 'all'
                                        ? "Add uncategorized task..."
                                        : `Add task in "${activeGroup?.name}"...`
                                }
                                className="w-full bg-white border-2 border-transparent shadow-sm rounded-2xl px-5 py-4 pr-16 focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                                <Plus size={24} />
                            </button>
                        </form>

                        <div className="space-y-3">
                            {displayTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                    onModify={handleModifyTodo}
                                />
                            ))}
                            {displayTodos.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                                        <LayoutList size={40} className="text-slate-300" />
                                    </div>
                                    <p>No tasks yet, start planning your day!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <EditTodoModal
                todo={editingTodo}
                groups={groups}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTodo(null);
                }}
                onSave={handleSaveTodo}
            />
        </div>
    );
};
