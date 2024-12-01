import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-white font-bold" : "text-gray-400"
                        }
                    >
                        Login
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/project"
                        className={({ isActive }) =>
                            isActive ? "text-white font-bold" : "text-gray-400"
                        }
                    >
                        Projects
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            isActive ? "text-white font-bold" : "text-gray-400"
                        }
                    >
                        Users
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/timelog"
                        className={({ isActive }) =>
                            isActive ? "text-white font-bold" : "text-gray-400"
                        }
                    >
                        Time Logs
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
