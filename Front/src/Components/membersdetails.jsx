import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import Sidebar from './Sidebar';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
function Details() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    axios.get(`https://fitness-wxxo.onrender.com/Members?ownerId=${ownerId}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching revenue details:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("ownerId"); 
    localStorage.removeItem("gymname"); 
    toast.success("Logged out successfully");
    navigate("/Login");
  };

  return (
    <>
      <Sidebar />
      <div className="main">
        <header>
          <h1>Members Info</h1>
          <NavLink to='/Login' id="logout" onClick={handleLogout}><span ><LogoutIcon /> Logout</span></NavLink>
        </header>
        <hr id="hrdash" />

        <div className="member-container">
          <table className="members-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>No members found</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};


export default Details;
