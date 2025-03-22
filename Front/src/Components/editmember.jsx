import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LogoutIcon from '@mui/icons-material/Logout';
function Editmember() {
  const { state } = useLocation();
  const { id } = state || {};
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const [emember, setEmember] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "",
    planId: "",
    planPrice: "",
    joinDate: "",
    nextDueDate: "",
  });

  useEffect(() => {
    if (id) {
      axios.get(`https://fitness-wxxo.onrender.com/Member/${id}`)
        .then((res) => {
          const fetchedMember = res.data;
          setEmember({
            ...fetchedMember,
            planId: fetchedMember.planId || "", 
            renewalDate: calculateRenewalDate(fetchedMember.joinDate, fetchedMember.plan),
          });
        })
        .catch((err) => console.error("Error fetching member:", err));
    }
  }, [id]);
   
  useEffect(() => {
    axios.get("https://fitness-wxxo.onrender.com/plans")
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "planId") {
      const selectedPlan = plans.find((p) => p._id === value);
      setEmember({
        ...emember,
        plan: selectedPlan ? selectedPlan.name : "",
        planId: value,  // Ensure planId is properly updated
        planPrice: selectedPlan ? selectedPlan.price : "",
      });
    } else {
      setEmember({ ...emember, [name]: value });
    }
  };

  const calculateRenewalDate = (joinDate, planName) => {
    const planDurations = {
      "1 Month": 1,
      "3 Months": 3,
      "6 Months": 6,
      "1 Year": 12,
    };
    const renewalDate = new Date(joinDate);
    renewalDate.setMonth(renewalDate.getMonth() + (planDurations[planName] || 0));
    return renewalDate.toISOString().split("T")[0];
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const ownerId = localStorage.getItem("ownerId");
    axios.patch(`https://fitness-wxxo.onrender.com/Updatemember/${id}`, {
      name: emember.name,
      email: emember.email,
      phone: emember.phone,
      planId: emember.planId, 
      planPrice: emember.planPrice,
      joinDate: emember.joinDate,
      renewalDate: emember.nextDueDate,
      ownerId: ownerId,
    })
      .then(() => {
        toast.success("Member Updated Successfully!");
        navigate("/Members");
      })
      .catch((err) => {
        console.error("Error updating member:", err);
      });
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
          <h1>Edit Member</h1>
          <span id="logout" onClick={handleLogout}><LogoutIcon/>Logout</span>
        </header>
        <hr id="hrdash" />
        <div className="editmember">
          <form onSubmit={handleUpdate}>
            <label>Name:
              <input type="text" name="name" value={emember.name} onChange={(e) => setEmember({ ...emember, name: e.target.value })} required autoComplete="off" />
            </label>
            <label>Email:
              <input type="email" name="email" value={emember.email} onChange={(e) => setEmember({ ...emember, email: e.target.value })} required autoComplete="off" />
            </label>
            <label>Phone:
              <input type="text" name="phone" value={emember.phone} onChange={(e) => setEmember({ ...emember, phone: e.target.value })} required autoComplete="off"  />
            </label>
            <label>Plan:
              <select name="planId" value={emember.planId} onChange={handleEditChange} required>
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.name}</option>
                ))}
              </select>
            </label>

            <label>Plan Price:
              <input type="number" name="planPrice" value={emember.planPrice} onChange={(e) => setEmember({ ...emember, planPrice: e.target.value })} required readOnly />
            </label>
            <label>Joining Date:
              <input type="date" name="joinDate" value={emember.joinDate} onChange={(e) => setEmember({ ...emember, joinDate: e.target.value })} required />
            </label>
            <label>Renewal Date:
              <input type="date" name="renewalDate" value={emember.nextDueDate} onChange={(e) => setEmember({ ...emember, nextDueDate: e.target.value })} />
            </label>
            <button type="submit">Update Member</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Editmember;
