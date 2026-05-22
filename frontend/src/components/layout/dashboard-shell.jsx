"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Menu, Search } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { performLogout, selectAuthUser } from "@/store/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function DashboardShell({ sidebar, children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const avatarLabel = hasMounted && user?.name ? user.name.slice(0, 1).toUpperCase() : "U";
  const displayName = hasMounted && user?.name ? user.name : "Account";
  const displayEmail = hasMounted && user?.email ? user.email : "Session active";

  const handleLogout = async () => {
    await dispatch(performLogout());
    window.location.assign("/login");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-450 gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden lg:block lg:w-[20rem] lg:shrink-0">
          <div className="glass-panel sticky top-4 h-[calc(100vh-2rem)] overflow-hidden rounded-[28px]">
            {sidebar}
          </div>
        </aside>

        <AnimatePresence>
          {mobileSidebarOpen ? (
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {mobileSidebarOpen ? (
            <motion.aside
              className="glass-panel fixed left-4 top-4 z-50 h-[calc(100vh-2rem)] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[28px] lg:hidden"
              initial={{ x: -360 }}
              animate={{ x: 0 }}
              exit={{ x: -360 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              {sidebar}
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <header className="glass-panel sticky top-4 z-30 rounded-[28px] px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20">
                    <span className="text-lg font-bold">T</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600/80">Trello Flow</p>
                    <h1 className="text-lg font-semibold tracking-tight text-slate-950">Board command center</h1>
                  </div>
                </div>
              </div>

              <div className="hidden min-w-0 flex-1 px-6 lg:block">
                <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <Search className="h-4 w-4 text-orange-500" />
                  <span>Use the inbox search to filter unassigned tasks</span>
                </div>
              </div>

              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                  onClick={() => setProfileOpen((current) => !current)}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-400 text-sm font-semibold text-white">
                    <span suppressHydrationWarning>{avatarLabel}</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-950" suppressHydrationWarning>
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-500" suppressHydrationWarning>
                      {displayEmail}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                <AnimatePresence>
                  {profileOpen ? (
                    <motion.div
                      className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-2 shadow-[0_28px_80px_rgba(15,23,42,0.16)] backdrop-blur"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.1),transparent_22%)]" />
    </div>
  );
}