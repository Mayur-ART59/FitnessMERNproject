const express = require('express');
const app = express();

const mongoose = require('mongoose');
require('dotenv').config();

const cors = require('cors');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB is connected"))
  .catch((e) => console.log(e));
app.listen(PORT, () => { console.log(`Server Started At Port ${PORT}`) });

// Models
const UserData = require('./Usermodel')
const Members = require('./Membersmodel')
const Revenue = require('./Revenuemodel');
const Plan = require('./Membershipmodel');

// Middleware
app.use(cors({
  origin: "https://gymdesk.netlify.app"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/ping',(req,res)=>{
  res.status(200).send('Server is up')
})
// SignUP
app.post('/Signup', async (req, res) => {
  try {
    const { name, email, password, gymname } = req.body;

    let user = new UserData({ name, email, password, gymname });
    let result = await user.save();
    res.json(result);
  }
  catch (error) {
    res.status(500).json({ message: 'Error Creating User', error });
  }
});

// SignIn
app.post('/SignIn', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid Password' });
    }
    res.status(200).json({ message: 'Login Successfull', username: user.name, role: user.role, ownerId: user._id,gymname:user.gymname });
  }
  catch (error) {
    res.status(500).json({ message: 'Error Signing In', error });
  }
});

// Get Username
app.get("/getUsername", async (req, res) => {
  try {
    const user = await UserData.findOne(); 
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    res.status(200).json({ username: user.name });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});


// Add New Member
app.post('/Addmember', async (req, res) => {
  try {
    const { name, email, phone, planId, joinDate,ownerId } = req.body;
    console.log("Received data:", { name, email, phone, planId, joinDate,ownerId});

    const selectedPlan = await Plan.findById(planId);
    if (!selectedPlan) {
      console.log("Plan not found:", planId);
      return res.status(404).json({ message: "Plan not found" });
    }
    console.log("Selected Plan:", selectedPlan);
    const planDurations = {
      "1 Month": 1,
      "3 Months": 3,
      "6 Months": 6,
      "9 Months": 9,
      "1 Year": 12,
    };
    if (!planDurations[selectedPlan.duration]) {
      console.log("Invalid plan duration:", selectedPlan.duration);
      return res.status(400).json({ message: "Invalid plan duration" });
    }
    const nextDueDate = new Date(joinDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + planDurations[selectedPlan.duration]);

    console.log("Next Due Date:", nextDueDate);

    // add new member
    let newMember = new Members({
      name,
      email,
      phone,
      planId: selectedPlan._id,
      plan: selectedPlan.name,
      planPrice: selectedPlan.price,
      joinDate,
      nextDueDate: nextDueDate.toISOString().split("T")[0],
      ownerId,
    });

    console.log("New Member:", newMember);

    let result = await newMember.save();
    console.log("New Member Saved:", result);

    let newRevenue = new Revenue({
      totalRevenue: selectedPlan.price,
      member: name,
      ownerId,
    });
    console.log("New Revenue:", newRevenue);

    await newRevenue.save();
    console.log("New Revenue Saved:", newRevenue);
    res.status(201).json({ message: "Member added successfully!", result });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Error adding member", error: error.message });
  }
});


// Display Members Details 
app.get('/Members', async (req, res) => {
  try {
    const { ownerId } = req.query;
    let members = await Members.find({ ownerId }).populate("planId", "name");
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error });
  }
});


// Display Unique Members Details
app.get('/Member/:id', async (req, res) => {
  try {
    const user = await Members.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Update Member Details
app.patch('/Updatemember/:id', async (req, res) => {
  try {
    const { name,email,phone, planId, joinDate, renewalDate,ownerId } = req.body;
    const planDurations = {
      "1 Month": 1,
      "3 Months": 3,
      "6 Months": 6,
      "9 Months": 9,
      "1 Year": 12,
    };
    const selectedPlan = await Plan.findById(planId);
      if (!oldMember) {
        return res.status(404).json({ message: "Member not found" });
      }
    if (!selectedPlan) {
      return res.status(404).json({ message: "Plan not found" });
      
    }
    const nextDueDate = new Date(renewalDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + planDurations[selectedPlan.duration]);
    console.log("Searching for member with ID:", req.params.id, "and ownerId:", ownerId);
    const oldMember = await Members.findOne({ _id: req.params.id, ownerId: req.body.ownerId }).populate ('planId');

    if (!oldMember) {
      return res.status(404).json({ message: "Member not found" });
    }


    let revenue = await Revenue.findOne({ member: oldMember.name });
    if (!revenue) {
      return res.status(404).json({ message: "Revenue record not found" });
    }
    revenue.totalRevenue += selectedPlan.price;
    await revenue.save(); const updatedMember = await Members.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        planId: selectedPlan._id,
        plan: selectedPlan.name,
        planPrice: selectedPlan.price,
        joinDate,
        nextDueDate: nextDueDate.toISOString().split("T")[0],
        ownerId,
      },
      { new: true }
    );
    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member updated successfully", updatedMember });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Error updating member", error: error.message });
  }
});


// Delete Members Details
app.delete('/DeleteMembers/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let result = await Members.findByIdAndDelete(id);
    res.status(200).json({ message: "Member deleted successfully!", result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member", error });
  }
});

// Due Date Info
app.get('/UpcomingRenewals', async (req, res) => {
  try {
    const { ownerId } = req.query;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    let upcomingRenewals = await Members.find({ownerId,
      nextDueDate: {
        $gte: today.toISOString().split("T")[0],
        $lte: nextWeek.toISOString().split("T")[0]
      }
    }, "name plan nextDueDate"); // Fetch only necessary fields

    res.status(200).json(upcomingRenewals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming renewals", error });
  }
});

// Add New plans
app.post("/addplans", async (req, res) => {
  try {
    const { name, price, duration,ownerId } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ message: "Plan with this name already exists" });
    }
    const newPlan = new Plan({ name, price, duration,ownerId });

    const savedPlan = await newPlan.save();
    res.status(201).json({ message: "Plan added successfully!", savedPlan });
  } catch (error) {
    console.error("Error adding plan:", error);
    res.status(500).json({ message: "Error adding plan", error: error.message });
  }
});

// get membership PLans
app.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error });
  }
});

// Updating  Plans
app.patch('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating plan', error });
  }
});

//Deleting Plans
app.delete('/delete/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId } = req.body; 
    if (!ownerId) {
      return res.status(403).json({ message: 'Unauthorized: Owner ID required' });
    }
    
    const deletedPlan = await Plan.findByIdAndDelete(id);
    res.json({ message: 'Plan deleted successfully',deletedPlan });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error });
  }
}); 

// get revenue total form revenue db
app.get('/revenue', async (req, res) => {
  try {
    const { ownerId } = req.query;

    const revenue = await Revenue.aggregate([
      { $match: { ownerId: new mongoose.Types.ObjectId(ownerId) } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalRevenue" } } }
    ]);

    if (!revenue.length) {
      return res.status(404).json({ message: "No revenue data found" });
    }
    res.json({ totalRevenue: revenue[0].totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total revenue", error: error.message });
  }
});


// fetch details of members with revenue
app.get('/revenuedetails', async (req, res) => {
  try {
    const { ownerId } = req.query;
    const revenueDetails = await Revenue.find({ ownerId },
      
      { _id: 0, member: 1, totalRevenue: 1 });
    if (!revenueDetails.length) {
      return res.status(404).json({ message: "No revenue data found" });
    }
    res.json(revenueDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching revenue details", error: error.message });
  }
});




