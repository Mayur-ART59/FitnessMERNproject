import React, {useState,useEffect} from "react";
import { NavLink } from "react-router-dom";

function Sidebar() { 
  const [username, setUsername] = useState("Admin");
  const [gymname, setGymname] = useState("N/A");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedGymname = localStorage.getItem("gymname");
    if (storedGymname) {
      setGymname(storedGymname);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  return (
    <div className="sidebar">
      <div>
        <h3><ion-icon name="barbell"></ion-icon>Gym Management</h3>
      </div>
      <div className="admin">Welcome {username}<br/>
      {gymname === "N/A" ? <span> Gym: N/A</span> : <span>Gym: {gymname}</span>}
      </div> 
      <hr />
      <div className="nav">
        <nav>
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/members" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Members
              </NavLink>
            </li>
            <li>
              <NavLink to="/details" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Members Details
              </NavLink>
            </li>
            <li>
              <NavLink to="/revenue" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Revenue List
              </NavLink>
            </li>
            <li>
              <NavLink to="/plans" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Memberships
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
