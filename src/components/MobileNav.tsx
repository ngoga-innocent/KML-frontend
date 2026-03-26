import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
} from "lucide-react";

export const MobileNav = () => {
  const location = useLocation();

  const items = [
    { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Home" },
    { to: "/admin/clients", icon: <Users size={20} />, label: "Clients" },
    { to: "/admin/payments", icon: <Wallet size={20} />, label: "Payments" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      {items.map((item) => {
        const active = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center text-xs ${
              active ? "text-primary" : "text-gray-500"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};