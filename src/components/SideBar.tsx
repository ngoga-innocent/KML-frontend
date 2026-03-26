import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SIDEBAR_CONFIG } from "./SideBarConfig";
import type { RootState } from "../app/store";
import { ChevronDown, ChevronRight } from "lucide-react";
export function Sidebar({ open, setOpen, onLogout }: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<any>({});
  const { role } = useSelector((state: RootState) => state.auth);
  // console.log("user role",role)

  const toggleMenu = (label: string) => {
    setOpenMenus((prev: any) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };
  // 🚨 SECURITY: If no role → redirect
  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role]);

  // 🚨 SECURITY: If role not recognized
  if (!role || !SIDEBAR_CONFIG[role]) {
    return null;
  }
  useEffect(() => {
    const newOpenMenus: any = {};

    menuItems.forEach((item: any) => {
      if (item.children) {
        if (
          item.children.some((c: any) => location.pathname.startsWith(c.to))
        ) {
          newOpenMenus[item.label] = true;
        }
      }
    });

    setOpenMenus(newOpenMenus);
  }, [location.pathname]);
  const menuItems = SIDEBAR_CONFIG[role];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary text-white transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="font-bold text-lg">KML</span>

          <button onClick={() => setOpen(false)} className="md:hidden">
            <X />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto">
          <nav className="p-3 flex flex-col gap-2">
            {menuItems.map((item: any) => {
              const Icon = item.icon;

              // ✅ HAS CHILDREN (submenu)
              if (item.children) {
                const isOpen = openMenus[item.label];

                return (
                  <div key={item.label}>
                    {/* Parent */}
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </div>

                      <span className="text-xs">
                        {isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </span>
                    </button>

                    {/* Children */}
                    {isOpen && (
                      <div className="ml-6 mt-1 flex flex-col gap-1">
                        {item.children.map((child: any) => {
                          const active = location.pathname.startsWith(child.to);

                          return (
                            <Link
                              key={child.to}
                              to={child.to}
                              className={`p-2 rounded-md text-sm ${
                                active
                                  ? "bg-white text-primary font-semibold"
                                  : "hover:bg-white/10"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // ✅ NORMAL ITEM
              const active = location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
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

          {/* Logout */}
          <div className="mt-auto p-4 border-t border-white/10">
            <button onClick={onLogout} className="text-red-300 text-sm">
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
const MenuItem = ({ to, icon, label }: any) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-lg transition text-sm ${
        active
          ? "bg-white text-primary font-semibold shadow"
          : "hover:bg-white/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
