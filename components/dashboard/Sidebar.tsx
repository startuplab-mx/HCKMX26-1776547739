"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  LayoutDashboard,
  Map,
  Radio,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarPage =
  | "dashboard"
  | "map"
  | "signals"
  | "reports"
  | "settings";

interface SidebarProps {
  active: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems: { id: SidebarPage; label: string; Icon: React.ElementType }[] = [
  { id: "dashboard", label: "Panel",                   Icon: LayoutDashboard },
  { id: "map",       label: "Inteligencia de Mapa",    Icon: Map             },
  { id: "signals",   label: "Señales Digitales",       Icon: Radio           },
  { id: "reports",   label: "Informes",                Icon: FileText        },
  { id: "settings",  label: "Configuración",           Icon: Settings        },
];

export default function Sidebar({
  active,
  onNavigate,
  onLogout,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  function handleNavigate(page: SidebarPage) {
    onNavigate(page);
    onMobileClose?.();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 224 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-slate-100 bg-white overflow-hidden",
          // Mobile: fixed drawer, slides in/out via transform
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: normal in-flow sidebar (undo mobile fixed styles)
          "lg:relative lg:inset-y-auto lg:left-auto lg:z-auto lg:translate-x-0 lg:transition-none"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600">
                <Layers className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Layers<span className="text-brand-600">Intel</span>
              </span>
            </motion.div>
          )}
          {collapsed && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 mx-auto">
              <Layers className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          {/* Mobile close button */}
          {!collapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => handleNavigate(id)}
              title={collapsed ? label : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group",
                active === id
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active === id ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {label}
                </motion.span>
              )}
              {!collapsed && active === id && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-2 space-y-0.5">
          <button
            onClick={onLogout}
            title={collapsed ? "Cerrar sesión" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-400 hover:text-slate-700 transition-colors z-10"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </motion.aside>
    </>
  );
}
