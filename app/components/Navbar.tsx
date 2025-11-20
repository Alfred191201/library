"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  // 1. Use session to check role
  const { data: session } = useSession();
  
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 2. Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const genres = [
    "FICTION", "NON_FICTION", "SCIFI", "FANTASY",
    "MYSTERY", "ROMANCE", "HORROR", "HISTORY",
  ];

  const formatGenre = (genre: string) => {
    return genre.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm" 
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* --- Left Side Container --- */}
          <div className="flex items-center gap-8">
            
            {/* 1. Logo */}
            <Link href="/" className="group flex items-center gap-2">
               <span className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                 MyLibrary
               </span>
            </Link>

            {/* 2. Navigation Links */}
            <div className="hidden md:flex gap-1 text-sm font-medium items-center text-gray-600">
              
              {/* --- ADMIN LINK (Now the first item/Most Left) --- */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="mr-2 px-3 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 flex items-center gap-1 border border-red-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM1.25 5.75v6.5a.75.75 0 0 0 .375.65l7.75 4.5a.75.75 0 0 0 .75 0l7.75-4.5a.75.75 0 0 0 .375-.65v-6.5l-7.639 4.215a.75.75 0 0 1-.722 0L1.25 5.75Z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Admin</span>
                </Link>
              )}

              {/* Standard Links */}
              <NavLink href="/">Home</NavLink>
              <NavLink href="/authors">Authors</NavLink>

              {/* Genre Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                  onBlur={() => setTimeout(() => setIsGenreOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 transition-all focus:outline-none hover:text-blue-600"
                >
                  Genre
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isGenreOpen ? "rotate-180 text-blue-600" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Content */}
                <div 
                  className={`absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-200 origin-top-left ${
                    isGenreOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-2">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genre/${genre}`}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {formatGenre(genre)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Side (Search + Profile) --- */}
          <div className="flex items-center gap-4">
            <form action="/search" className="relative hidden sm:block group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="q"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-100 text-gray-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all border border-transparent focus:border-blue-500/50"
              />
            </form>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-semibold text-gray-700 leading-none">{session.user?.name}</span>
                  <span className="text-[10px] text-gray-400 leading-none mt-1 capitalize">
                    {session.user.role}
                  </span>
                </div>
                
                <button 
                  onClick={() => signOut()} 
                  className="p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Sign Out"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-900/20"
              >
                <span>Sign In</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

// Helper Component for standard links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="px-3 py-2 rounded-full hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
  >
    {children}
  </Link>
);

export default Navbar;