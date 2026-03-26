import { Menu, LogOut } from "lucide-react";

export const Header = ({ onMenu, onLogout }: any) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
      
      {/* ALWAYS visible on mobile */}
      <button
        onClick={onMenu}
        className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
      >
        <Menu size={22} />
      </button>

      <h1 className="text-sm font-semibold text-gray-700">
        Kigali Microloans
      </h1>

      <div className="flex items-center gap-3">
        <button
          onClick={onLogout}
          className="hidden sm:flex items-center gap-1 text-sm text-red-500"
        >
          <LogOut size={16} />
          Logout
        </button>

        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          A
        </div>
      </div>
    </header>
  );
};