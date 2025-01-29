import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './landing/LandingPage';
import SetLimit from './admin/SetLimit';
import SetPrice from './admin/SetPrice';
import AdminViewAllUsers from './admin/AdminViewAllUsers';
import Laout from './admin/Laout';
import ServoControl from './users/ServoControl';
import Waterflow from './users/WaterFlow';
import ViewAnalytics from './users/ViewAnalytics';
import Userlayout from './users/Userlayout';
import Authentic from './authentication/Authentic'; 
import { UserContext } from './authentication/UserContext';
import ListOfAdmin from './admin/ListOfAdmin';
import OtherSettings from './admin/OtherSettings';
import Payment from './users/Payment';



function App() {
  const user = useContext(UserContext);

  return (
    <Router  basename="/domestic_water_wastage_prevention_system">
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />
        {/* Authentication Route */}
        <Route path="/auth" element={<Authentic />} />

        {/* Admin Routes */}
        <Route path='admin/' element={<Laout />}>
          <Route path="setlimit" element={<SetLimit />} />
          <Route path="setprice" element={<SetPrice />} />
          <Route path="viewusers" element={<AdminViewAllUsers />} />
          <Route path="listofadmin" element={<ListOfAdmin />} />
          <Route path="other-settings" element={<OtherSettings />} />
        </Route>

        {/* User Routes */}
        <Route path='user/' element={<Userlayout />}>
          {user ? (
            <>
              <Route path="servoControl" element={<ServoControl userId={user.email} />} />
              <Route path="waterflow" element={<Waterflow userId={user.email} />} />
              <Route path="viewanalytics" element={<ViewAnalytics userId={user.email} />} />
              <Route path="payment" element={<Payment  userId={user.email} />} />
            </>
          ) : (
            <Route path="*" element={<Authentic />} /> 
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
