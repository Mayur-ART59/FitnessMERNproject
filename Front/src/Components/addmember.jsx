import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LogoutIcon from '@mui/icons-material/Logout';
function AddMember() {
  const [member, setMember] = useState({
    name: "",
    plan: "",
    planPrice: "",
    joinDate: "",
    email: "",
    phone: "",
  });

  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/plans")
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "plan") {
      const selectedPlan = plans.find((p) => p._id === value);

      setMember({
        ...member,
        plan: selectedPlan ? selectedPlan.name : "",
        planId: value,
        planPrice: selectedPlan ? selectedPlan.price : "",
      });
    } else {
      setMember({ ...member, [name]: value });
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const ownerId = localStorage.getItem("ownerId");
    if(!ownerId){
      toast.error("Please login to add member");
      navigate("/Login");
      return;
    }
    axios
      .post("http://localhost:5000/Addmember", {
        name: member.name,
        planId: member.planId,
        joinDate: member.joinDate,
        email: member.email,
        phone: member.phone,
        ownerId,
      })
      .then((res) => {
        toast.success("Member Added Successfully!");
        navigate("/Members");
      })
      .catch((err) => console.error(err));
  };
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
          <h1>Add Member</h1>
          <span id="logout" onClick={handleLogout}><LogoutIcon />Logout</span>
        </header>
        <hr id="hrdash" />
        <div className="addmember">
          <form onSubmit={handleSubmit}>
            <label>Name:
              <input type="text" name="name" value={member.name} onChange={handleChange} required autoComplete="off" />
            </label>
            <label>Email:
              <input type="email" name="email" value={member.email} onChange={handleChange} required autoComplete="off" />
            </label>
            <label>Phone:
              <input type="text" name="phone" value={member.phone} onChange={handleChange} required autoComplete="off"  />
            </label>
            <label>Plan:
              <select name="plan" value={member.planId} onChange={handleChange} required>
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.name}</option>
                ))}
              </select>
            </label>

            <label>Plan Price:
              <input type="number" name="planPrice" value={member.planPrice} onChange={handleChange} required readOnly />
            </label>
            <label>Joining Date:
              <input type="date" name="joinDate" value={member.joinDate} onChange={handleChange} required />
            </label>
            <button type="submit">Add Member</button>
          </form>
        </div>



      </div>
    </>
  );
}

export default AddMember;
