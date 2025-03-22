import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import Sidebar from './Sidebar';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
function Revenue() {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    axios.get(`https://fitness-wxxo.onrender.com/revenuedetails?ownerId=${ownerId}`)
      .then(res => setRevenueData(res.data))
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
          <h1>Total Revenue</h1>
          <NavLink to='/Login' id="logout" onClick={handleLogout}><span ><LogoutIcon /> Logout</span></NavLink>
        </header>
        <hr id="hrdash" />

        <div className="member-container">
          <table className="members-table">
            <thead>
              <tr>
                
                <th>Name</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>No members found</td>
                </tr>
              ) : (
                revenueData.map((item, index) => (
                  <tr key={index}>
                    
                    <td>{item.member}</td>
                    <td>₹{item.totalRevenue}</td>
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


export default Revenue;
