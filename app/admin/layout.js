import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex max-w-content gap-8 px-5 py-10">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
