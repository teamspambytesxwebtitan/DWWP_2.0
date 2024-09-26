// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import UserSidebar from './UserSidebar'

// function userlayout() {
//   return (
  
//   <>
//   <UserSidebar/>
//     {/* <div>userlayout</div> */}
//     <Outlet/>
//   </>
  
//   )
// }

// export default userlayout

// src/users/Userlayout.jsx


// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import UserSidebar from './UserSidebar';
// import '../allCss/userlayout.css'; // Import the CSS file for styling

// function Userlayout() {
//   return (
//     <div className="user-layout">
//       <UserSidebar />
//       <div className="profile-container">
//         <div className="profile-info">
//           {/* Replace with actual user profile info */}
//           <span className="profile-name">hi</span>
//           <span className="profile-email">user@example.com</span>
//         </div>
//       </div>
//       <Outlet />
//     </div>
//   );
// }

// export default Userlayout;

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import { auth } from "../firebaseConfig"; // Import auth from Firebase
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase Auth function
import '../allCss/userlayout.css'; // Import the CSS file for styling

function Userlayout() {
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
    <div className="user-layout">
      <UserSidebar />
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
      <Outlet />
    </div>
  );
}

export default Userlayout;
