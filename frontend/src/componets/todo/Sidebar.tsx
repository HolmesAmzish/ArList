import React from 'react';
import { Hash, Plus, Folder } from 'lucide-react';
import { Group } from '../../types';

interface SidebarProps {
    groups: Group[];
    activeId: string | number;
    onSelect: (id: string | number) => void;
    onAddGroup: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ groups, activeId, onSelect, onAddGroup }) => (
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
                    <button
                        key={group.id}
                        onClick={() => onSelect(group.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            activeId === group.id ? 'bg-white shadow-sm text-indigo-600 font-medium ring-1 ring-slate-200' : 'hover:bg-slate-200 text-slate-600'
                        }`}
                    >
                        <Folder size={18} className={activeId === group.id ? 'text-indigo-500' : 'text-slate-400'} />
                        <span className="truncate">{group.name}</span>
                    </button>
                ))}
            </div>
        </nav>
    </aside>
);
