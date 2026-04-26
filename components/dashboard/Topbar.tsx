"use client";

import { useState } from "react";
import { Bell, Search, LogOut, ChevronDown, User, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onLogout: () => void;
  alertCount?: number;
  onMenuToggle?: () => void;
}

export default function Topbar({
  title,
  subtitle,
  onLogout,
  alertCount = 3,
  onMenuToggle,
}: TopbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-6 gap-3">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="min-w-0 flex-1 lg:flex-none">
        <h1 className="text-sm sm:text-base font-semibold text-slate-900 truncate">{title}</h1>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar zonas, alertas…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-50 transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all">
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </button>

        {/* User avatar / menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 sm:px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white hover:border-slate-300 transition-all"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="hidden sm:block">Analista</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-slate-100 bg-white shadow-card py-1 z-50"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-900">Analista</div>
                  <div className="text-[10px] text-slate-400">layers@intel.gov</div>
                </div>
                <button
                  onClick={() => { setUserMenuOpen(false); onLogout(); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
