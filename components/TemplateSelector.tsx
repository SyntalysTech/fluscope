import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Folder, KeyRound, ShoppingCart, Bomb } from 'lucide-react';
import { Lang } from './LanguageSelector';

interface TemplateSelectorProps {
    lang: Lang;
    onSelect: (val: string) => void;
    dict: any;
}

export function TemplateSelector({ lang, onSelect, dict }: TemplateSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { id: 'auth', label: 'Auth Flow', icon: <KeyRound size={14} className="text-slate-400 group-hover:text-indigo-400 transition-colors" /> },
        { id: 'checkout', label: 'Checkout', icon: <ShoppingCart size={14} className="text-slate-400 group-hover:text-indigo-400 transition-colors" /> },
        { id: 'broken', label: dict.loadBroken, icon: <Bomb size={14} className="text-red-400 group-hover:animate-pulse" />, className: "text-red-400 font-bold hover:bg-red-500/10" }
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600 rounded-lg text-xs font-medium text-slate-300 transition-all shadow-sm"
            >
                <Folder size={14} className="text-indigo-400" />
                <span className="hidden sm:inline tracking-wide font-semibold">{dict.loadTemplate}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-48 bg-[#0F172A]/95 backdrop-blur-xl border border-slate-700/70 rounded-xl shadow-2xl shadow-indigo-900/10 overflow-hidden z-50 flex flex-col p-1.5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800/50 mb-1">
                        {dict.loadTemplate}
                    </div>
                    {options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => { onSelect(opt.id); setIsOpen(false); }}
                            className={`group flex items-center gap-2.5 px-3 py-2.5 text-xs text-left rounded-lg transition-colors text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 ${opt.className || ''}`}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
