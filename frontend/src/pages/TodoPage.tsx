
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../componets/todo/Sidebar.tsx';
import { TodoItem } from '../componets/todo/TodoItem.tsx';
import { EditTodoModal } from '../componets/todo/EditTodoModal.tsx';
import { EditGroupModal } from '../componets/todo/EditGroupModal.tsx';
import { Plus, LayoutList, Loader, Menu, X } from 'lucide-react';
import type {Group, Todo, TodoCreateRequest, PaginatedResponse} from '../types.ts';
import { groupApi, todoApi } from '../api.ts';

export const TodoPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [activeId, setActiveId] = useState<string | number>('all');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 20,
        totalPages: 0,
        totalElements: 0,
        hasMore: false,
    });

    useEffect(() => {
        loadGroups();
        loadTodos(0, true); // Initial load
    }, []);

    useEffect(() => {
        // When activeId changes, reset todos and load first page
        setTodos([]);
        loadTodos(0, true);
    }, [activeId]);

    const loadGroups = async () => {
        try {
            const groupsData = await groupApi.getAllGroups();
            setGroups(groupsData);
        } catch (error) {
            console.error('Failed to load groups:', error);
        }
    };

    const loadTodos = async (page: number, reset: boolean = false) => {
        if (page === 0 && !reset) return;
        
        const loadingState = page > 0 ? setLoadingMore : setLoading;
        loadingState(true);
        
        try {
            const groupId = typeof activeId === 'number' ? activeId : undefined;
            const response: PaginatedResponse<Todo> = await todoApi.getTodos(page, pagination.size, groupId);
            
            if (reset) {
                setTodos(response.content);
            } else {
                setTodos(prev => [...prev, ...response.content]);
            }
            
            setPagination({
                page: response.page.number,
                size: response.page.size,
                totalPages: response.page.totalPages,
                totalElements: response.page.totalElements,
                hasMore: response.page.number < response.page.totalPages - 1,
            });
        } catch (error) {
            console.error('Failed to load todos:', error);
        } finally {
            loadingState(false);
        }
    };

    const handleAddGroup = async () => {
        const name = prompt('Enter group name:');
        if (!name?.trim()) return;

        try {
            await groupApi.addGroup({ name, description: '' });
            await loadGroups(); // Reload groups
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
            // Reload current page of todos
            loadTodos(0, true);
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const handleToggleTodo = async (id: number) => {
        try {
            await todoApi.toggleCompleteTodo(id);
            // Optimistically update the todo in the list
            setTodos(prev => prev.map(todo => 
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            ));
        } catch (error) {
            console.error('Failed to toggle todo:', error);
            // Reload on error
            loadTodos(0, true);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        // Optimistically remove
        setTodos(prev => prev.filter(todo => todo.id !== id));
        try {
            await todoApi.deleteTodo(id);
        } catch (error) {
            console.error('Failed to delete todo:', error);
            // Reload on error
            loadTodos(0, true);
        }
    };

    const handleModifyTodo = (id: number) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            setEditingTodo(todo);
            setIsTodoModalOpen(true);
        }
    };

    const handleModifyGroup = (group: Group) => {
        setEditingGroup(group);
        setIsGroupModalOpen(true);
    };

    const handleDeleteGroup = async (groupId: number) => {
        if (!window.confirm('Are you sure you want to delete this group? Tasks in this group will become uncategorized.')) {
            return;
        }
        setGroups(prev => prev.filter(group => group.id !== groupId));
        try {
            await groupApi.deleteGroup(groupId);
            // If the active group is the one being deleted, switch to 'all'
            if (activeId === groupId) {
                setActiveId('all');
            }
        } catch (error) {
            console.error('Failed to delete group:', error);
            await loadGroups();
        }
    };

    const handleSaveGroup = async (updatedGroupPartial: Partial<Group>) => {
        try {
            // Find existing group to merge
            const existingGroup = groups.find(g => g.id === updatedGroupPartial.id);
            if (!existingGroup) {
                console.error('Group not found:', updatedGroupPartial.id);
                return;
            }
            const updatedGroup = { ...existingGroup, ...updatedGroupPartial } as Group;
            await groupApi.updateGroup(updatedGroup);
            // Reload groups
            await loadGroups();
        } catch (error) {
            console.error('Failed to update group:', error);
        }
    };

    const handleSaveTodo = async (updatedTodoPartial: Partial<Todo>) => {
        try {
            // Find the existing todo to merge
            const existingTodo = todos.find(t => t.id === updatedTodoPartial.id);
            if (!existingTodo) {
                console.error('Todo not found:', updatedTodoPartial.id);
                return;
            }
            const updatedTodo = { ...existingTodo, ...updatedTodoPartial } as Todo;
            await todoApi.updateTodo(updatedTodo);
            // Update the todo in the list
            setTodos(prev => prev.map(todo => 
                todo.id === updatedTodo.id ? updatedTodo : todo
            ));
        } catch (error) {
            console.error('Failed to update todo:', error);
            // Reload on error
            loadTodos(0, true);
        }
    };

    const handleLoadMore = () => {
        if (pagination.hasMore && !loadingMore) {
            loadTodos(pagination.page + 1, false);
        }
    };

    const activeGroup = groups.find(g => g.id === activeId);
    // No need to filter client-side since API returns filtered results
    const displayTodos = todos;

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar for desktop, drawer for mobile */}
            <div className={`hidden md:flex ${isSidebarOpen ? 'flex' : 'hidden'} md:relative md:flex`}>
                <Sidebar
                    groups={groups}
                    activeId={activeId}
                    onSelect={(id) => {
                        setActiveId(id);
                        // Close sidebar on mobile after selection
                        setIsSidebarOpen(false);
                    }}
                    onAddGroup={handleAddGroup}
                    onModifyGroup={handleModifyGroup}
                    onDeleteGroup={handleDeleteGroup}
                />
            </div>
            
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-slate-50 border-r border-slate-200 z-30 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar
                    groups={groups}
                    activeId={activeId}
                    onSelect={(id) => {
                        setActiveId(id);
                        setIsSidebarOpen(false);
                    }}
                    onAddGroup={handleAddGroup}
                    onModifyGroup={handleModifyGroup}
                    onDeleteGroup={handleDeleteGroup}
                />
            </div>

            <main className="flex-1 flex flex-col bg-slate-50/50">
                <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button 
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-200 rounded-lg"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <LayoutList className="text-indigo-600" size={20} />
                        <h1 className="text-lg font-bold text-slate-800">
                            {activeId === 'all' ? 'All Tasks' : activeGroup?.name}
                        </h1>
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
              {pagination.totalElements}
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
                            {loading && (
                                <div className="flex justify-center py-8">
                                    <Loader className="animate-spin text-indigo-600" size={24} />
                                </div>
                            )}
                            {!loading && displayTodos.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                                        <LayoutList size={40} className="text-slate-300" />
                                    </div>
                                    <p>No tasks yet, start planning your day!</p>
                                </div>
                            )}
                            {pagination.hasMore && (
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loadingMore ? (
                                            <span className="flex items-center gap-2">
                                                <Loader className="animate-spin" size={16} />
                                                Loading...
                                            </span>
                                        ) : (
                                            'Load More'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <EditTodoModal
                todo={editingTodo}
                groups={groups}
                isOpen={isTodoModalOpen}
                onClose={() => {
                    setIsTodoModalOpen(false);
                    setEditingTodo(null);
                }}
                onSave={handleSaveTodo}
            />

            <EditGroupModal
                group={editingGroup}
                isOpen={isGroupModalOpen}
                onClose={() => {
                    setIsGroupModalOpen(false);
                    setEditingGroup(null);
                }}
                onSave={handleSaveGroup}
                onDelete={handleDeleteGroup}
            />
        </div>
    );
};
