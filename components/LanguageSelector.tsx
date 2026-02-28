import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type Lang = "en" | "es" | "fr";

export function LanguageSelector({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const langs = [
        { code: 'en', label: 'EN', flag: '🇬🇧' },
        { code: 'es', label: 'ES', flag: '🇪🇸' },
        { code: 'fr', label: 'FR', flag: '🇫🇷' },
    ];

    const current = langs.find(l => l.code === lang) || langs[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 hover:bg-slate-800 text-slate-300 rounded-xl shadow-xl transition-all font-medium text-xs"
            >
                <span className="text-sm">{current.flag}</span>
                <span className="hidden sm:inline tracking-wide">{current.label}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-3 w-32 bg-[#0F172A]/95 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl shadow-indigo-900/10 overflow-hidden z-50 flex flex-col p-1.5 animate-in fade-in zoom-in-95 duration-200">
                        {langs.map(l => (
                            <button
                                key={l.code}
                                onClick={() => { setLang(l.code as Lang); setIsOpen(false); }}
                                className={`flex items-center justify-between px-3 py-2.5 text-xs text-left rounded-xl transition-colors ${lang === l.code ? 'bg-indigo-500/15 text-indigo-300 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-base">{l.flag}</span>
                                    {l.label}
                                </div>
                                {lang === l.code && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
