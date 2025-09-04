import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../hooks/useAuth";

function Layout2() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // refreshUser();
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-[var(--backGround)]">
      <div className="flex justify-center">
        <div className="flex flex-row w-full max-w-[1200px]">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout2;
