import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from "react-toastify";
//use comments for better understanding

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    axios.get(`https://gymdesk.onrender.com/revenue?ownerId=${ownerId}`)
      .then((res) => {
        setTotalRevenue(res.data.totalRevenue);
      })
      .catch((err) => {
        console.log("Error fetching total revenue:", err);
      });

    // Fetch Total Members
    
    axios.get(`https://gymdesk.onrender.com/Members?ownerId=${ownerId}`)
      .then((res) => {
        setMembers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  
      // Fetch Upcoming Renewals
      axios
      .get(`https://gymdesk.onrender.com/UpcomingRenewals?ownerId=${ownerId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching members:", err);
      });
  }, [localStorage.getItem("ownerId")]);
     
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
      <div className='main'>
        <header>
          <h1>Dashboard</h1>
          <NavLink to='/Login' id="logout" onClick={handleLogout}><span><LogoutIcon /> Logout</span></NavLink>
        </header>
        <hr id="hrdash" />
        <div className="stats-container">
          <NavLink to="/Members" style={{ textDecoration: 'none' }} className="stat-card">
            <div className="stat-content">
            <ion-icon name="person-outline"></ion-icon>
              <h3>Total Members</h3>
              <span>{members.length}</span>
            </div>
          </NavLink>
          <NavLink to="/revenue" style={{ textDecoration: 'none' }} className="stat-card">
            <div className="stat-content">
            <ion-icon name="cash-outline"></ion-icon>
              <h3>Revenue</h3>
              <span>₹{totalRevenue}</span>
            </div>
          </NavLink>
        </div>

      
        <div className="member-container">
          <h3 style={{marginTop:'20px'}}>📅 Upcoming Renewals</h3>
          <table className="members-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No Upcoming Dues</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.plan}</td>
                    <td>{item.nextDueDate}</td>
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

export default Dashboard;
