import React, { useState } from 'react';
import { Sidebar } from '../components/todo/Sidebar';
import { TodoItem } from '../components/todo/TodoItem';
import { Plus, LayoutList } from 'lucide-react';
import { Group, Todo } from '../types';

export const TodoPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [activeId, setActiveId] = useState('all');
    const [inputValue, setInputValue] = useState('');

    // 这里的逻辑将来替换为你的 API 调用
    const handleAddGroup = () => {
        const name = prompt('请输入分组名称:');
        if (name) setGroups([...groups, { id: crypto.randomUUID(), name }]);
    };

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || activeId === 'all') return;
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            groupId: activeId,
            text: inputValue,
            completed: false
        };
        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const activeGroup = groups.find(g => g.id === activeId);
    const displayTodos = activeId === 'all' ? todos : todos.filter(t => t.groupId === activeId);

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
                            {activeId === 'all' ? '全部任务' : activeGroup?.name}
                        </h1>
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
              {displayTodos.length}
            </span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* 只有在具体分组下才能快速添加任务 */}
                        {activeId !== 'all' ? (
                            <form onSubmit={handleAddTodo} className="relative group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={`在 "${activeGroup?.name}" 中添加任务...`}
                                    className="w-full bg-white border-2 border-transparent shadow-sm rounded-2xl px-5 py-4 pr-16 focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder:text-slate-400"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                                    <Plus size={24} />
                                </button>
                            </form>
                        ) : (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-600 text-sm">
                                💡 请先在左侧选择一个具体分组来添加任务。
                            </div>
                        )}

                        <div className="space-y-3">
                            {displayTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={(id) => {/* API logic */}}
                                    onDelete={(id) => {/* API logic */}}
                                />
                            ))}
                            {displayTodos.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                                        <LayoutList size={40} className="text-slate-300" />
                                    </div>
                                    <p>暂无任务，开始规划你的一天吧</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};