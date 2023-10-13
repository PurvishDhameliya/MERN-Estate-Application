import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
const Header = () => {
  const [inputHandler, setInputHandler] = useState("");
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold sm:text-xl flex flex-wrap text-sm items-center">
            <span>sight</span>
            <span>view</span>
          </h1>
        </Link>
        <form className="p-3 bg-slate-300 rounded-lg flex justify-end items-center">
          <input
            type="text"
            placeholder="Search.."
            className=" outline-none rounded-lg bg-transparent relative w-24 sm:w-64"
            value={inputHandler}
            onChange={(e) => setInputHandler(e.target.value)}
          />
          <FaSearch className="absolute" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-500 hover:underline ">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-500 hover:underline">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className=" sm:inline text-slate-500 hover:underline ">
              Sign In
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
