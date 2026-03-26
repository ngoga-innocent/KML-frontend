import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../components/SideBar";
import { Header } from "../components/Header";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    sessionStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <Header onMenu={() => setSidebarOpen(true)} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;