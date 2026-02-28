import React from 'react';
import { Settings, Copy, Trash2, Link as LinkIcon, Plus, LayoutGrid, Paintbrush, Power, CircleDot } from 'lucide-react';

export type ContextMenuItem = {
    id: string;
    label: string;
    icon?: React.ReactNode;
    destructive?: boolean;
    onClick: () => void;
};

interface CanvasContextMenuProps {
    x: number;
    y: number;
    title?: string;
    items: ContextMenuItem[];
    onClose: () => void;
}

export function CanvasContextMenu({ x, y, title, items, onClose }: CanvasContextMenuProps) {
    // Keep menu within viewport logic simplified
    const style: React.CSSProperties = {
        top: y,
        left: x,
    };

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div
                className="fixed z-50 w-48 bg-[#1E293B]/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                style={style}
            >
                {title && (
                    <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-700/50 bg-slate-900/30">
                        {title}
                    </div>
                )}
                <div className="p-1.5 flex flex-col gap-0.5">
                    {items.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                item.onClick();
                                onClose();
                            }}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors w-full text-left
                                ${item.destructive
                                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
