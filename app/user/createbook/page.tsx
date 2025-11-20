import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // <--- IMPORT THIS, NOT HANDLER
import CreateBookForm from "@/app/components/create_form/CreateBookForm";

export default async function CreateBookPage() {
  // Pass the options object here
  const session = await getServerSession(authOptions);

  // Security Check
  if (!session || !session.user) {
    redirect("/login");
  }
  
  const userId = session.user.id;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
       <CreateBookForm currentUserId={userId} />
    </div>
  );
}