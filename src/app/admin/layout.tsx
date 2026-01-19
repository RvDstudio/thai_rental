import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-server";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await requireAdmin();

  if (!authResult.authorized) {
    if (authResult.reason === "not_authenticated") {
      redirect("/sign-in");
    }
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
