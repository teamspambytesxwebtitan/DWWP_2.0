import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, db } from "../firebaseConfig"; 
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore"; 
import UserSidebar from './UserSidebar';
import '../allCss/userlayout.css';

function Userlayout() {
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    aadharNumber: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch Firestore user details
        const docRef = doc(db, `users/${currentUser.email}`);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const userDetails = userDoc.data().userDetails;
          setUserData({
            displayName: currentUser.displayName || userDetails[0],
            email: currentUser.email,
            phoneNumber: userDetails[1],
            aadharNumber: userDetails[2],
            address: userDetails[3]
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
    setShowUpdateUser(false); // Ensure update form is closed when opening profile
  };
  
  const toggleUpdateUser = () => {
    setShowUpdateUser(!showUpdateUser);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: userData.displayName,
      });

      const docRef = doc(db, `users/${auth.currentUser.email}`);

      await updateDoc(docRef, { 
        userDetails: [
          userData.displayName, 
          userData.phoneNumber, 
          userData.aadharNumber, 
          userData.address
        ] 
      });

      alert("Profile updated successfully!");
      setShowUpdateUser(false); // Close update form
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="user-layout">
      <UserSidebar />
      <div className="profile-container">
        <div className="profile-info">
          {user ? (
            <>
              <span className="profile-email">{user.email}</span>
              <button className="arrow-button" onClick={toggleExpansion}>
                {isExpanded ? (
                  // SVG for expanded state
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 122.883 122.882">
                  <g>
                    <path fill='#ffff' d="M0,61.441L0,61.441h0.018c0,16.976,6.872,32.335,17.98,43.443c11.108,11.107,26.467,17.979,43.441,17.979v0.018h0.001 h0.001v-0.018c16.974,0,32.335-6.872,43.443-17.98s17.98-26.467,17.98-43.441h0.018v-0.001V61.44h-0.018 c0-16.975-6.873-32.334-17.98-43.443C93.775,6.89,78.418,0.018,61.443,0.018V0h-0.002l0,0v0.018 c-16.975,0-32.335,6.872-43.443,17.98C6.89,29.106,0.018,44.465,0.018,61.439H0V61.441L0,61.441z M42.48,71.7 c-1.962,1.908-5.101,1.865-7.009-0.098c-1.909-1.962-1.865-5.101,0.097-7.009l22.521-21.839l3.456,3.553l-3.46-3.569 c1.971-1.911,5.117-1.862,7.029,0.108c0.055,0.058,0.109,0.115,0.16,0.175L87.33,64.594c1.963,1.908,2.006,5.047,0.098,7.009 c-1.908,1.963-5.047,2.006-7.01,0.098L61.53,53.227L42.48,71.7L42.48,71.7z"/>
                  </g>
                </svg>
              ) : (
                /* SVG for collapsed state */
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 122.883 122.882">
                  <g>
                    <path fill='#ffff' d="M0,61.441L0,61.441l0.018-0.001c0-16.975,6.872-32.334,17.98-43.443C29.106,6.89,44.465,0.018,61.44,0.018V0h0.001h0.001 v0.018c16.974,0,32.335,6.872,43.443,17.98s17.98,26.467,17.98,43.441h0.018v0.002l0,0h-0.018c0,16.976-6.873,32.335-17.98,43.443 c-11.109,11.107-26.467,17.979-43.442,17.979v0.018h-0.002l0,0v-0.018c-16.975,0-32.335-6.872-43.443-17.98 C6.89,93.775,0.018,78.417,0.018,61.442L0,61.441L0,61.441L0,61.441z M42.48,51.182c-1.962-1.909-5.101-1.865-7.009,0.097 s-1.865,5.101,0.097,7.009l22.521,21.839l3.456-3.553l-3.46,3.568c1.971,1.911,5.117,1.862,7.029-0.108 c0.055-0.058,0.109-0.115,0.16-0.175L87.33,58.288c1.963-1.908,2.006-5.046,0.098-7.009s-5.047-2.006-7.01-0.097L61.53,69.655 L42.48,51.182L42.48,51.182z"/>
                  </g>
                </svg>
                )}
              </button>
              {isExpanded && (
                <div className="expanded-buttons">
                  <button className="edit-details-button" onClick={toggleUserProfile}>
                    Edit Details
                  </button>
                  <button className="signout-button" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <span>Loading user info...</span>
          )}
        </div>
      </div>

      {/* Overlay for User Profile */}
      {showUserProfile && (
        <div className="overlay22">
          <div className="profile-container1" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowUserProfile(false)}>X</button>
            <div className="profile-info1">
              <span className="profile-email">{userData.email}</span>
              <span className="profile-name">Customer Name: {userData.displayName || "error"}</span>
              <span className="profile-phone">Phone Number: {userData.phoneNumber}</span>
              <span className="profile-aadhar">Aadhar Number: {userData.aadharNumber}</span><br/>
              <span className="profile-address">Address: {userData.address}</span>
            </div> 
            <hr />
              <button className="update-button" onClick={toggleUpdateUser}>Update Details</button>
          </div>
        </div>
      )}

      {/* Overlay for Update User Details */}
      {showUpdateUser && (
        <div className="overlay22">
          <div className="update-form-container" onClick={(e) => e.stopPropagation()}>
            <div className="close-button-container"> 
              <button className="close-button-for-update" onClick={() => setShowUpdateUser(false)}>X</button>
            </div>
         
            <h3>Update Your Details</h3>
          
            <label>
              Display Name:
              <input
                type="text"
                name="displayName"
                value={userData.displayName}
                onChange={handleInputChange}
              />
            </label><br/>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
              />
            </label><br/>
            <label>
              Aadhar Number:
              <input
                type="text"
                name="aadharNumber"
                value={userData.aadharNumber}
                onChange={handleInputChange}
              />
            </label><br/>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
              />
            </label><br/>
            <button onClick={handleUpdate}>Save Changes</button>
          </div>
        </div>
      )}
  
      <Outlet />
    </div>
  );
}

export default Userlayout;
