import React, { useState, useRef, useEffect } from 'react';
import { Hash, Plus, Folder, MoreVertical, Edit, Trash2, Sun, Moon, GripVertical } from 'lucide-react';
import { Group } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
    groups: Group[];
    activeId: string | number;
    onSelect: (id: string | number) => void;
    onAddGroup: () => void;
    onModifyGroup: (group: Group) => void;
    onDeleteGroup: (groupId: number) => void;
    onReorderGroups: (reorderedGroups: Group[]) => void;
}

interface SortableGroupItemProps {
    group: Group;
    activeId: string | number;
    openDropdownId: number | null;
    activeDragId: number | null;
    onSelect: (id: string | number) => void;
    onModifyGroup: (group: Group) => void;
    onDeleteGroup: (groupId: number) => void;
    onDropdownToggle: (groupId: number, e: React.MouseEvent) => void;
    dropdownRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

const SortableGroupItem: React.FC<SortableGroupItemProps> = ({
    group,
    activeId,
    openDropdownId,
    activeDragId,
    onSelect,
    onModifyGroup,
    onDeleteGroup,
    onDropdownToggle,
    dropdownRefs,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: group.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleModify = (e: React.MouseEvent) => {
        e.stopPropagation();
        onModifyGroup(group);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDeleteGroup(group.id);
    };

    const isAnyDragging = activeDragId !== null;
    const isThisDragging = isDragging;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group"
        >
            <div
                onClick={() => onSelect(group.id)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(group.id);
                    }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select category ${group.name}`}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    activeId === group.id 
                        ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400 font-medium ring-1 ring-slate-200 dark:ring-slate-700' 
                        : `${isAnyDragging ? 'text-slate-600 dark:text-slate-400' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`
                } ${isAnyDragging ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                        {...attributes}
                        {...listeners}
                        className={`p-1 -ml-1 text-slate-400 dark:text-slate-500 transition-opacity ${
                            isAnyDragging ? 'cursor-default' : 'hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing'
                        } ${isAnyDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isAnyDragging && !isThisDragging}
                    >
                        <GripVertical size={16} />
                    </button>
                    <Folder size={18} className={activeId === group.id ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                    <span className="truncate">{group.name}</span>
                </div>
                {activeId === group.id && (
                    <button
                        onClick={(e) => onDropdownToggle(group.id, e)}
                        className={`p-1 rounded transition-opacity ${
                            isAnyDragging ? '' : 'hover:bg-slate-300 dark:hover:bg-slate-700'
                        } ${openDropdownId === group.id ? 'bg-slate-300 dark:bg-slate-700 opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        disabled={isAnyDragging}
                    >
                        <MoreVertical size={16} className="text-slate-700 dark:text-slate-300" />
                    </button>
                )}
            </div>

            {/* Dropdown menu */}
            {openDropdownId === group.id && (
                <div
                    ref={(el) => { dropdownRefs.current[group.id] = el; }}
                    className="absolute right-0 top-full mt-1 z-10 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2"
                >
                    <button
                        onClick={handleModify}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Edit size={16} className="text-slate-500 dark:text-slate-400" />
                        Modify
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                    >
                        <Trash2 size={16} className="text-rose-500 dark:text-rose-400" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
    groups, 
    activeId, 
    onSelect, 
    onAddGroup,
    onModifyGroup,
    onDeleteGroup,
    onReorderGroups
}) => {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [activeDragId, setActiveDragId] = useState<number | null>(null);
    const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const { theme, toggleTheme } = useTheme();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDropdownToggle = (groupId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === groupId ? null : groupId);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as number);
        setOpenDropdownId(null); // Close any open dropdowns when dragging starts
    };

    // Sort groups by orderIndex (largest first = top position)
    const sortedGroups = [...groups].sort((a, b) => {
        // Handle null values - treat them as -1 (bottom)
        const aIndex = a.orderIndex ?? -1;
        const bIndex = b.orderIndex ?? -1;
        return bIndex - aIndex; // Descending order
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (over && active.id !== over.id) {
            const oldIndex = sortedGroups.findIndex((group) => group.id === active.id);
            const newIndex = sortedGroups.findIndex((group) => group.id === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedGroups = arrayMove(sortedGroups, oldIndex, newIndex);
                // Update orderIndex values based on new positions (larger index = newer/top)
                const updatedGroups = reorderedGroups.map((group, index) => ({
                    ...group,
                    orderIndex: reorderedGroups.length - 1 - index, // Reverse so top has largest number
                }));
                onReorderGroups(updatedGroups);
            }
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId !== null) {
                const dropdownElement = dropdownRefs.current[openDropdownId];
                if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
                    setOpenDropdownId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    return (
        <aside className="w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-6">
                <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">My Lists</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                <button
                    onClick={() => onSelect('all')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        activeId === 'all' 
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' 
                            : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                    <Hash size={18} className={activeId === 'all' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500'} /> All Tasks
                </button>

                <div className="pt-4 pb-2 flex items-center justify-between px-3">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Categories</span>
                    <button onClick={onAddGroup} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 dark:text-slate-400 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortedGroups.map(group => group.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-1">
                            {sortedGroups.map((group) => (
                                <SortableGroupItem
                                    key={group.id}
                                    group={group}
                                    activeId={activeId}
                                    openDropdownId={openDropdownId}
                                    activeDragId={activeDragId}
                                    onSelect={onSelect}
                                    onModifyGroup={onModifyGroup}
                                    onDeleteGroup={onDeleteGroup}
                                    onDropdownToggle={handleDropdownToggle}
                                    dropdownRefs={dropdownRefs}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </nav>
            
            {/* Theme toggle button at the bottom */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                >
                    {theme === 'dark' ? (
                        <>
                            <Sun size={20} className="text-amber-500" />
                            <span className="font-medium">Switch to Light Mode</span>
                        </>
                    ) : (
                        <>
                            <Moon size={20} className="text-indigo-600 dark:text-indigo-400" />
                            <span className="font-medium">Switch to Dark Mode</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};
