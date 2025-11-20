// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth"; // This should now work

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Logic: If no user, OR user role is not admin -> redirect
  // It is safer to check .role instead of .id, but .id works if your admin ID is literally "admin"
  if (!currentUser || currentUser.role !== 'admin') { 
    redirect('/');
  }

  return <>{children}</>;
}