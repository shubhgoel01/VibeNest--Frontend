import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Trending from "../components/Trending.jsx";
import { useAuth } from "../hooks/useAuth";

function Layout1() {
  const { isLoggedIn, refreshUser, user } = useAuth();

  useEffect(() => {
    // Always try to refresh on mount (even if isLoggedIn might already be true)
    if(!user){
      refreshUser();}
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-[var(--backGround)]">
      <div className="flex justify-center">
        <div className="flex flex-row w-full max-w-[1400px]">
          <Sidebar />
          <Outlet />
          <Trending />
        </div>
      </div>
    </div>
  );
}

export default Layout1;
