import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";

import { SIDEBAR_CONFIG } from "./SideBarConfig";
import type { RootState } from "../app/store";

import { useGetLoansQuery } from "../api/loanApi";
import { useGetApplicationsQuery } from "../api/loanapplication";

export function Sidebar({ open, setOpen, onLogout }: any) {
  const location = useLocation();
  const navigate = useNavigate();

  const { role } = useSelector((state: RootState) => state.auth);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  /* =========================
     DATA (LIVE COUNTS)
  ========================= */
  const { data: loans = [] } = useGetLoansQuery(undefined, {
    pollingInterval: 100000,
  });

  const { data: applications = [] } = useGetApplicationsQuery(undefined, {
    pollingInterval: 100000,
  });

  const pendingLoans = useMemo(
    () => loans.filter((l: any) => l.status === "pending").length,
    [loans],
  );

  const pendingApplications = useMemo(
    () => applications.filter((a: any) => a.status === "pending").length,
    [applications],
  );

  /* =========================
     SECURITY CHECKS
  ========================= */
  useEffect(() => {
    if (!role) navigate("/");
  }, [role, navigate]);

  if (!role || !SIDEBAR_CONFIG[role]) return null;

  const baseMenu = SIDEBAR_CONFIG[role];

  /* =========================
     ENRICH MENU WITH COUNTS
  ========================= */
  const menuItems = useMemo(() => {
    return baseMenu.map((item: any) => {
      if (!item.children) return item;

      return {
        ...item,
        children: item.children.map((child: any) => {
          if (child.to === "/dashboard/loans") {
            return { ...child, count: pendingLoans };
          }

          if (child.to === "/dashboard/loan-applications") {
            return { ...child, count: pendingApplications };
          }

          return child;
        }),
      };
    });
  }, [baseMenu, pendingLoans, pendingApplications]);

  /* =========================
     AUTO OPEN ACTIVE MENU
  ========================= */
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};

    menuItems.forEach((item: any) => {
      if (item.children) {
        const isActive = item.children.some((c: any) =>
          location.pathname.startsWith(c.to),
        );

        if (isActive) {
          newOpenMenus[item.label] = true;
        }
      }
    });

    setOpenMenus(newOpenMenus);
  }, [location.pathname, menuItems]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary text-white transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-bold text-lg">KML</span>

          <button onClick={() => setOpen(false)} className="md:hidden">
            <X />
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto">
          <nav className="p-3 flex flex-col gap-2">
            {menuItems.map((item: any) => {
              const Icon = item.icon;

              /* =========================
                 CHILD MENU
              ========================= */
              if (item.children) {
                const isOpen = openMenus[item.label];

                return (
                  <div key={item.label}>
                    {/* PARENT */}
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </div>

                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {/* CHILDREN */}
                    {isOpen && (
                      <div className="ml-6 mt-1 flex flex-col gap-1">
                        {item.children.map((child: any) => {
                          const active = location.pathname.startsWith(
                            child.to,
                          );

                          return (
                            <Link
                              key={child.to}
                              to={child.to}
                              className={`flex items-center justify-between p-2 rounded-md text-sm transition ${
                                active
                                  ? "bg-white text-primary font-semibold"
                                  : "hover:bg-white/10"
                              }`}
                            >
                              <span>{child.label}</span>

                              {child.count > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {child.count}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              /* =========================
                 SINGLE MENU ITEM
              ========================= */
              const active = location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm transition ${
                    active
                      ? "bg-white text-primary font-semibold shadow"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="mt-auto p-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="text-red-300 text-sm hover:text-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}