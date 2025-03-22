import React from 'react'
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gymname: "",
  });
  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://fitness-wxxo.onrender.com/Signup', form)
      .then((res) => {
        console.log(res.data);
        toast.success("Signed Up Successfully!", {
          position: "top-right"
        });
        navigate('/Login');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <>
      <div className="headd"><h2>Welcome To Gym Management System</h2></div>
      <section className="auth-container">
        <div className="form-box">
          <div className="form-value">
            <form onSubmit={handleSubmit}>
              <h2>Sign Up</h2>


              <div className="inputbox">
                <ion-icon name="person-outline" />
                <input type="text" name="name" value={form.name} autoComplete='off' onChange={handleForm} required />
                <label>Name</label>
              </div>


              <div className="inputbox">
                <ion-icon name="mail-outline" />
                <input type="email" name='email' value={form.email} autoComplete='off' onChange={handleForm} required />
                <label>Email</label>
              </div>


              <div className="inputbox">
                <input type={showPassword ? "text" : "password"} name='password' value={form.password} onChange={handleForm} required />
                <label>Password</label>
                <ion-icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
                />

              </div>


              <div className="inputbox">
                <ion-icon name="barbell-outline" />
                <input type="text" name='gymname' value={form.gymname} spellCheck="false" autoComplete='off' onChange={handleForm} required />
                <label>Gym Name</label>
              </div>
              <button className="buttonsign" type='submit'>Sign Up</button>
              <div className="register">
                <p>Already have an account ? <NavLink to="/Login">Sign In</NavLink></p>
              </div>
            </form>
          </div>
        </div>
      </section>



    </>
  )
}

export default Signup;
