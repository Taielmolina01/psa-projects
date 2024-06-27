import React from "react";
import Link from "next/link";
import Image from "next/image";

function NavBar() {
  return (
    <nav className="flex justify-between p-5 bg-gray-100 border-b-2 border-blue-900">
      <div className="flex gap-5">
        <Link
          href="/"
          className="mx-2 transform transition-transform duration-200 hover:scale-110"
        >
          <Image src="/home.svg" width={27} height={27} alt="home icon" />
        </Link>
        <Link
          href="/proyectos"
          className="hover:text-sky-600 font-sans text-lg mx-2 transform transition-transform duration-200 hover:scale-105"
        >
          Proyectos
        </Link>
        <Link
          href="/soporte"
          className="hover:text-sky-600 font-sans text-lg mx-2 transform transition-transform duration-200 hover:scale-105"
        >
          Soporte
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
