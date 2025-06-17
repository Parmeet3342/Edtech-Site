import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/DashBoard/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";

export const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const [open, setOpen] = useState(false);
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="lg:flex min-h-[calc(100vh-3.5rem)] hidden">
        <Sidebar />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="max-w-[1000px] mx-auto w-11/12 py-10">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="lg:hidden w-full relative block">
        <button onClick={() => setOpen(!open)}>
            <GiHamburgerMenu className="text-richblack-100 text-xl ml-2 mt-2" />
        </button>
        {
            open && (
                <Sidebar setOpen = {setOpen} open = {open}/>
            )
        }
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto w-full">
          <div className="w-[98%] py-10 mx-auto ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
