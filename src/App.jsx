import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import New_Dwwp2_0_landing from './landing/New_Dwwp2_0_landing';

import { UserContext } from "./authentication/UserContext";

import Testing from "./users/Dashboard.jsx";
import WaterUsageGraph from "./users/Graph.jsx";
import Servo_Control from "./users/Servo_Control.jsx";
import PaymentsDashboard from "./users/PaymentsDashboard.jsx";
import Subscription from "./users/Subscription.jsx";
// import Payment from "./users/Payment.jsx";
import Online_Status from "./users/Online_Status.jsx";
import DashboardCard from "./users/DashboardCard.jsx";
import RaiseComplaint from "./users/RaiseComplain.jsx";
import UserSettingsSection from "./users/User_section_settings.jsx";

import Admin_main from "./admin/Admin_main.jsx";
import Admin_View_user from "./admin/Admin_View_user.jsx";
import Admin_Limit_user from "./admin/Admin_Limit_user.jsx";
import Admin_setPrice from "./admin/Admin_setPrice.jsx";
import Admin_Broadcast from "./admin/Admin_Broadcast.jsx";
import NewDWWPAuth from "./authentication/New_dwwp_auth";
import New_AdminDashboard from "./admin/New_AdminDashboard.jsx";
import AppPerformance from "./admin/App_performance.jsx";
import Admin_see_UserFeedBack from "./admin/Admin_see_UserFeedBack.jsx";

function App() {
  const { user} = useContext(UserContext); // ✅ Get loading state
  // console.log(userId?.email);
  
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<New_Dwwp2_0_landing />} />

          <Route path="/newAuth" element={<NewDWWPAuth />}></Route>
          <Route path="land" element={<New_Dwwp2_0_landing />}></Route>
        {/* // user route */}
        <Route path="user/" element={<Testing />}>
          <Route path="gateControl" element={<Servo_Control userId={user?.email} />} />
          <Route path="graph" element={<WaterUsageGraph />} />
          <Route path="pay/" element={<PaymentsDashboard />}>
          </Route>

          <Route path="topup/" element={<Subscription />}>
          </Route>

          <Route path="onlineStatus" element={<Online_Status status={"offline"} days={14} />}/>
          <Route path="dashboard" element={<DashboardCard userId={user?.email} />} />
          <Route path="complain" element={<RaiseComplaint />} />
          <Route path="user_settings" element={<UserSettingsSection />} />
        </Route>

        {/* // Admin route  */}

        <Route path="newadmin" element={<Admin_main />}>
          <Route path="admin_view_user" element={<Admin_View_user />} />
          <Route path="admin_limit_user" element={<Admin_Limit_user />} />
          <Route path="admin_setPrice" element={<Admin_setPrice />} />
          <Route path="admin_Brodcast" element={<Admin_Broadcast />} />
          <Route path="admin_Dashboard" element={<New_AdminDashboard />} />
          <Route path="app_performence" element={<AppPerformance />} />
          <Route  path="Admin_see_UserFeedback" element={<Admin_see_UserFeedBack />} />
        </Route>
      
      </Routes>
    </Router>
  );
}

export default App;
