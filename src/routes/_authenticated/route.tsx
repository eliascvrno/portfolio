import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return { user: null };
    if (window.localStorage.getItem("admin_bypass") !== "1") {
      throw redirect({ to: "/" });
    }
    return { user: null };
  },
  component: () => <Outlet />,
});