import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ToastContainer from "../components/Toast";

export default function MainLayout() {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
