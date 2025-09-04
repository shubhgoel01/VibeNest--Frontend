import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../index.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SearchUserDialog from "../dialogs/SearchUserDialog";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const userIcon = user?.avatar?.url ?? "/personPlaceHolder.png";
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { icon: "home", label: "Home", path: "/" },
    { icon: "search", label: "Search", path: "#", onClick: () => setShowSearchDialog(true) },
    { icon: "circle_notifications", label: "Requests", path: "/socialtabsPage" },
    { icon: "chat_bubble", label: "Messages", path: "/messages" },
    { icon: "group", label: "Communities", path: "/communities" },
    { icon: "person_4", label: "Profile", path: `/user/${user?._id}/posts` },
    { icon: "more_horiz", label: "More", path: "/more" },
  ];

  return (
    <div className="p-6 flex flex-col bg-[var(--backGround)] overflow-y-auto overflow-x-hidden w-[72px] md:w-[220px] items-center h-[100vh]">
      {showSearchDialog && (
        <SearchUserDialog visible={showSearchDialog} onClose={() => setShowSearchDialog(false)} />
      )}

      <div className="w-full h-auto flex flex-col items-center md:items-start gap-7 text-white">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain rounded-full" />

        <ul className="flex flex-col gap-7 items-center md:items-start">
          {navItems.map((item, index) => (
            <li key={index} className="flex items-center font-medium text-[var(--textColor)] hover:text-[var(--textHover)]">
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="p-1 rounded-full flex flex-row gap-2 hover:bg-blue-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="hidden md:block">{item.label}</span>
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `p-1 rounded-full flex flex-row gap-2 ${isActive ? "bg-blue-500" : ""}`
                  }
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="hidden md:block">{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {isLoggedIn ? (
          <div className="flex flex-col gap-3 w-full">
            {/* User Info */}
            <div className="hidden md:flex gap-2 w-full">
              <img src={userIcon} alt="Avatar" className="h-12 w-12 rounded-full object-cover" />
              <div className="flex flex-col text-white">
                <p className="font-bold text-sm">{user?.userName}</p>
                <p className="font-extralight text-sm">{user?.email}</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 rounded-full cursor-pointer hover:bg-red-500 hover:text-white md:h-auto p-2 h-auto md:w-[150px] transition duration-300 ease-in-out flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        ) : (
          <button
            className="border border-[var(--borderLight)] rounded-full cursor-pointer hover:bg-[var(--buttonBg)] hover:text-black md:h-auto p-2 h-auto md:w-[150px] transition duration-300 ease-in-out"
            onClick={() => navigate("/login", { replace: true })}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
