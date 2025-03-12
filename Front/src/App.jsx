import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Signup from './Components/Signup';
import Login from './Components/Login';
import DashBoard from './Components/DashBoard';
import { ToastContainer } from 'react-toastify';
import Members from './Members';
import Addmember from './Components/addmember';
import Editmember from './Components/editmember';
import MembershipPlans from './Components/plans';
import Editplanmodal from './Components/editplanmodal';
import Revenue from './Components/revenue';
import Details from './Components/membersdetails';


function App() {

  return (
    <>
      <ToastContainer autoClose='2000' position='bottom-right' />

      <Routes>

        <Route path="/" element={<Signup></Signup>}></Route>
        <Route path="/Signup" element={<Signup></Signup>}></Route>
        <Route path="/Login" element={<Login></Login>}></Route>
        <Route path="/DashBoard" element={<DashBoard></DashBoard>}></Route>
        <Route path="/Members" element={<Members></Members>}></Route>
        <Route path="/Addmember" element={<Addmember></Addmember>}></Route>
        <Route path="/plans" element={<MembershipPlans></MembershipPlans>}></Route>
        <Route path="/editplanmodal" element={<Editplanmodal></Editplanmodal>}></Route>
        <Route path="/editmember" element={<Editmember></Editmember>}></Route>
        <Route path="/revenue" element={<Revenue></Revenue>}></Route>
        <Route path="/details" element={<Details></Details>}></Route>
      </Routes>
    </>
  )
}

export default App;
