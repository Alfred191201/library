"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"; // <--- Import this

const Navbar = () => {
  const { data: session } = useSession(); // <--- Check login status
  const [isGenreOpen, setIsGenreOpen] = useState(false);

  const genres = [
    "FICTION", "NON_FICTION", "SCIFI", "FANTASY",
    "MYSTERY", "ROMANCE", "HORROR", "HISTORY",
  ];

  const formatGenre = (genre: string) => {
    return genre.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-200">
              MyLibrary
            </Link>

            <div className="hidden md:flex gap-6 text-sm font-medium items-center">
              <Link href="/" className="hover:text-blue-200">Home</Link>
              <Link href="/authors" className="hover:text-blue-200">Authors</Link>

              {/* Genre Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                  className="flex items-center gap-1 hover:text-blue-200 focus:outline-none"
                >
                  Genre
                  <svg className={`w-4 h-4 transition-transform ${isGenreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isGenreOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 ring-1 ring-black ring-opacity-5">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genre/${genre}`}
                        onClick={() => setIsGenreOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {formatGenre(genre)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Search + Auth */}
          <div className="flex items-center gap-4">
            <form action="/search" className="relative hidden sm:block">
              <input
                type="text"
                name="q"
                placeholder="Search book title..."
                className="px-4 py-2 w-64 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 shadow-sm text-sm"
              />
            </form>

            {/* --- LOGIN / LOGOUT ICON --- */}
            {session ? (
              // If Logged In: Show Logout Button/Icon
              <div className="flex items-center gap-3">
                <span className="text-xs hidden lg:block">Hi, {session.user?.name}</span>
                <button 
                  onClick={() => signOut()} 
                  title="Sign Out"
                  className="hover:text-red-300 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                </button>
              </div>
            ) : (
              // If Logged Out: Show Login Icon
              <Link href="/login" title="Writer Login" className="hover:text-blue-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;