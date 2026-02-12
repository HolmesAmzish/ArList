
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../componets/todo/Sidebar.tsx';
import { TodoItem } from '../componets/todo/TodoItem.tsx';
import { EditTodoModal } from '../componets/todo/EditTodoModal.tsx';
import { EditGroupModal } from '../componets/todo/EditGroupModal.tsx';
import { Plus, LayoutList, Loader, Menu, X, LogOut } from 'lucide-react';
import type {Group, Todo, TodoCreateRequest, PaginatedResponse} from '../types.ts';
import { groupApi, todoApi, authApi } from '../utils/api.ts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const TodoPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout: authContextLogout } = useAuth();
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
    const [isAddingGroup, setIsAddingGroup] = useState(false);
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

    const handleAddGroup = () => {
        setIsAddingGroup(true);
        setIsGroupModalOpen(true);
    };

    const handleSaveNewGroup = async (newGroup: Partial<Group>) => {
        try {
            await groupApi.addGroup({ 
                name: newGroup.name || '', 
                description: newGroup.description || '' 
            });
            await loadGroups(); // Reload groups
        } catch (error) {
            console.error('Failed to add group:', error);
            throw error; // Re-throw to let modal handle error state
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
        if (!window.confirm('Are you sure you want to delete this todo?')) {
            return;
        }
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
            if (isAddingGroup) {
                // This is a new group creation
                await handleSaveNewGroup(updatedGroupPartial);
            } else {
                // This is an existing group update
                const existingGroup = groups.find(g => g.id === updatedGroupPartial.id);
                if (!existingGroup) {
                    console.error('Group not found:', updatedGroupPartial.id);
                    return;
                }
                const updatedGroup = { ...existingGroup, ...updatedGroupPartial } as Group;
                await groupApi.updateGroup(updatedGroup);
                // Reload groups
                await loadGroups();
            }
        } catch (error) {
            console.error('Failed to save group:', error);
            throw error; // Re-throw to let modal handle error state
        }
    };

    const handleReorderGroups = async (reorderedGroups: Group[]) => {
        try {
            // Update local state immediately for responsive UI
            setGroups(reorderedGroups);
            
            // Send update for each group that changed position
            // We need to update the orderIndex for all groups since positions changed
            for (const group of reorderedGroups) {
                await groupApi.updateGroupOrder(group);
            }
            
            // Reload groups to ensure consistency with backend
            await loadGroups();
        } catch (error) {
            console.error('Failed to reorder groups:', error);
            // Reload groups to revert to correct state
            await loadGroups();
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

    const handleLogout = () => {
        authApi.logout();
        authContextLogout();
        navigate('/login');
    };

    const activeGroup = groups.find(g => g.id === activeId);
    // No need to filter client-side since API returns filtered results
    const displayTodos = todos;

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
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
                    onReorderGroups={handleReorderGroups}
                />
            </div>
            
            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                    onReorderGroups={handleReorderGroups}
                />
            </div>

            <main className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button 
                            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <LayoutList className="text-indigo-600 dark:text-indigo-400" size={20} />
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {activeId === 'all' ? 'All Tasks' : activeGroup?.name}
                        </h1>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {pagination.totalElements}
            </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut size={16} />
                        <span className="hidden md:inline">Logout</span>
                    </button>
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
                                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 border-2 border-transparent dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 rounded-2xl px-5 py-4 pr-16 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-95">
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
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                        <LayoutList size={40} className="text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <p>No tasks yet, start planning your day!</p>
                                </div>
                            )}
                            {pagination.hasMore && (
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    setIsAddingGroup(false);
                }}
                onSave={handleSaveGroup}
                onDelete={handleDeleteGroup}
                isCreating={isAddingGroup}
            />
        </div>
    );
};
