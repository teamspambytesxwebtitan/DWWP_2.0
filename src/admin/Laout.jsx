import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { auth } from "../firebaseConfig"; // Import auth from Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase Auth function
import '../allCss/userlayout.css'; // Import the CSS file for styling

function Laout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign the user out
      navigate('/auth'); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  return (
    <>
    {/* thsi is layout  */}
    <Sidebar/>
    <div className="profile-container">
        <div className="profile-info">
          {/* Display the user's profile info dynamically */}
          {user ? (
            <>
              <span className="profile-email">{user.email}</span>
              {/* Sign-Out button visible on hover */}
              
              <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <span>Loading user info...</span>
          )}
        </div>
      </div>
    <Outlet/>

    </>
  )
}

export default Laout