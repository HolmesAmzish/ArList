import React, { useState, useRef, useEffect } from 'react';
import { Hash, Plus, Folder, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Group } from '../../types';

interface SidebarProps {
    groups: Group[];
    activeId: string | number;
    onSelect: (id: string | number) => void;
    onAddGroup: () => void;
    onModifyGroup: (group: Group) => void;
    onDeleteGroup: (groupId: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    groups, 
    activeId, 
    onSelect, 
    onAddGroup,
    onModifyGroup,
    onDeleteGroup
}) => {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const handleDropdownToggle = (groupId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === groupId ? null : groupId);
    };

    const handleModify = (group: Group, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        onModifyGroup(group);
    };

    const handleDelete = (groupId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        onDeleteGroup(groupId);
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
        <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
            <div className="p-6">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">My Lists</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                <button
                    onClick={() => onSelect('all')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        activeId === 'all' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-slate-200 text-slate-600'
                    }`}
                >
                    <Hash size={18} /> All Tasks
                </button>

                <div className="pt-4 pb-2 flex items-center justify-between px-3">
                    <span className="text-xs font-semibold text-slate-400">Categories</span>
                    <button onClick={onAddGroup} className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>

                <div className="space-y-1">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="relative group"
                        >
                            <button
                                onClick={() => onSelect(group.id)}
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all ${
                                    activeId === group.id ? 'bg-white shadow-sm text-indigo-600 font-medium ring-1 ring-slate-200' : 'hover:bg-slate-200 text-slate-600'
                                }`}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Folder size={18} className={activeId === group.id ? 'text-indigo-500' : 'text-slate-400'} />
                                    <span className="truncate">{group.name}</span>
                                </div>
                                <button
                                    onClick={(e) => handleDropdownToggle(group.id, e)}
                                    className={`p-1 rounded hover:bg-slate-300 transition-colors ${
                                        openDropdownId === group.id ? 'bg-slate-300' : 'opacity-0 group-hover:opacity-100'
                                    }`}
                                >
                                    <MoreVertical size={16} className="text-slate-500" />
                                </button>
                            </button>

                            {/* Dropdown menu */}
                            {openDropdownId === group.id && (
                                <div
                                    ref={(el) => { dropdownRefs.current[group.id] = el; }}
                                    className="absolute right-0 top-full mt-1 z-10 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2"
                                >
                                    <button
                                        onClick={(e) => handleModify(group, e)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-100 transition-colors"
                                    >
                                        <Edit size={16} className="text-slate-500" />
                                        Modify
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(group.id, e)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        <Trash2 size={16} className="text-rose-500" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>
        </aside>
    );
};
