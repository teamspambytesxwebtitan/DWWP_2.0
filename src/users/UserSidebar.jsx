import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../allCss/sidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure you import Firestore database

function UserSidebar() {
  const [username, setUsername] = useState(""); // State to hold username
  const[isExpanded, setIsExpanded] = useState(true)

   function HandleExpansion(){
    const newvar = !isExpanded
    setIsExpanded(!isExpanded)
  }
  const user = auth.currentUser; // Get the logged-in user

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.email); // Reference to the user's document
        const userDoc = await getDoc(userDocRef); // Get the document
        
        if (userDoc.exists()) {
          const userDetails = userDoc.data().userDetails; // Access userDetails array
          setUsername(userDetails[0]); // Set the username from the 0th index
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserDetails();
  }, [user]);
  return (
    <>
        <button className='expand-sidenavabr' onClick={HandleExpansion}> 
        {isExpanded ?(<div className='sidebar-close-button'><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.883px" height="122.882px" viewBox="0 0 122.883 122.882" enable-background="new 0 0 122.883 122.882" xml:space="preserve"><g><path fill='#ffff' d="M61.441,0L61.441,0l0.001,0.018c16.974,0,32.335,6.872,43.443,17.98s17.98,26.467,17.98,43.441h0.018v0.002l0,0h-0.018 c0,16.976-6.873,32.335-17.98,43.443c-11.109,11.107-26.467,17.979-43.442,17.979v0.018h-0.002l0,0v-0.018 c-16.975,0-32.335-6.872-43.443-17.98C6.89,93.775,0.018,78.417,0.018,61.442H0v-0.001V61.44h0.018 c0-16.975,6.872-32.334,17.98-43.443C29.106,6.89,44.465,0.018,61.44,0.018L61.441,0L61.441,0L61.441,0z M71.701,42.48 c1.908-1.962,1.863-5.101-0.098-7.009c-1.963-1.909-5.102-1.865-7.01,0.097L42.755,58.088l3.553,3.456l-3.568-3.46 c-1.911,1.971-1.863,5.118,0.108,7.029c0.058,0.056,0.116,0.109,0.175,0.162l21.571,22.057c1.908,1.962,5.047,2.006,7.01,0.097 c1.961-1.908,2.006-5.047,0.098-7.01L53.227,61.529L71.701,42.48L71.701,42.48z"/></g></svg></div> )
        :
       (<div className='sidebar-open-button'><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.88px" height="122.88px" viewBox="0 0 122.88 122.88" enable-background="new 0 0 122.88 122.88" xml:space="preserve"><g><path fill='#ffff' d="M61.439,0L61.439,0v0.016c-16.976,0-32.335,6.874-43.443,17.981S0.016,44.464,0.016,61.438H0v0.002l0,0h0.016 c0,16.978,6.874,32.336,17.981,43.444c11.107,11.106,26.467,17.98,43.441,17.98v0.016h0.002l0,0v-0.016 c16.977,0,32.336-6.874,43.443-17.98c11.107-11.108,17.981-26.467,17.981-43.441h0.016v-0.003l0,0h-0.016 c0-16.976-6.874-32.335-17.981-43.442S78.416,0.016,61.442,0.016V0H61.439L61.439,0z M51.181,42.479 c-1.909-1.964-1.864-5.1,0.098-7.01c1.961-1.909,5.1-1.866,7.009,0.098l21.838,22.519l-3.554,3.456l3.569-3.458 c1.91,1.971,1.862,5.116-0.108,7.027c-0.057,0.057-0.115,0.109-0.175,0.161L58.288,87.329c-1.909,1.963-5.048,2.007-7.009,0.097 c-1.962-1.907-2.007-5.045-0.098-7.009l18.473-18.889L51.181,42.479L51.181,42.479z"/></g></svg></div>)}</button>
        
      <div style={{width:isExpanded ? '80%':'5rem'}} className="sidenav">
        <br></br>
        {isExpanded? (
         <img src="https://cdn-icons-png.flaticon.com/512/9385/9385289.png" height={"150rem"}/>
        ):( <div className="sidenavimg"></div> )}
        <br></br>
        {isExpanded?(
          <h1>{username}</h1>
        ):( <div className="space-for-sidenav-h1">{username}</div>)}
        <br></br>
        {/* <br></br> */}
        
        
        <div className="nav-item">
          <NavLink to="/user/waterflow" className="nav-link">
            <div className="userIinnerNavbar">
              <svg 
                style={{width:'1.4rem'}}
                version="1.1" 
                id="Layer_1" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink" 
                // x="0px" 
                // y="0px" 
                viewBox="0 0 122.88 122.566" 
                enableBackground="new 0 0 122.88 122.566" 
                xmlSpace="preserve"
                >
                <g>
                    <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        fill="#ffff" 
                        d="M3.78,66.082h47.875c2.045,0,3.717,1.988,3.717,4.414v46.479c0,2.43-1.671,4.416-3.717,4.416H3.78 c-2.043,0-3.717-1.986-3.717-4.416V70.496C0.063,68.07,1.737,66.082,3.78,66.082L3.78,66.082z M71.224,0H119.1 c2.046,0,3.717,1.986,3.717,4.415v46.479c0,2.429-1.671,4.413-3.717,4.413H71.224c-2.045,0-3.714-1.984-3.714-4.413V4.415 C67.51,1.986,69.179,0,71.224,0L71.224,0z M3.714,0h47.878c2.045,0,3.717,1.986,3.717,4.415v46.479c0,2.429-1.671,4.413-3.717,4.413H3.714 C1.671,55.307,0,53.323,0,50.894V4.415C0,1.986,1.671,0,3.714,0L3.714,0z M71.287,67.26h47.876c2.043,0,3.717,1.986,3.717,4.416v46.479 c0,2.426-1.674,4.412-3.717,4.412H71.287c-2.045,0-3.717-1.986-3.717-4.412V71.676C67.57,69.246,69.242,67.26,71.287,67.26L71.287,67.26z"
                    />
                </g>
            </svg>
            {isExpanded?('Dashboard '):('')}
          </div>
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="/user/servocontrol" className="nav-link">
          <div className="userIinnerNavbar">
                <svg 
                  version="1.1" 
                  id="Layer_1" 
                  xmlns="http://www.w3.org/2000/svg" 
                  xmlnsXlink="http://www.w3.org/1999/xlink" 
                  viewBox="0 0 122.23 122.88" 
                  style={{ enableBackground: 'new 0 0 122.23 122.88' ,width:'1.4rem'}} 
                  xmlSpace="preserve"
                 // Maintain aspect ratio
              >
                  <style type="text/css">{`.st0{fill-rule:evenodd;clip-rule:evenodd;}`}</style>
                  <g>
                      <path fill="#ffff" 
                          className="st0" 
                          d="M122.23,12.35v10.54c0,1.29-1.21,2.35-2.69,2.35H77.85c-2.84,5.92-8.89,10.01-15.9,10.01c-7,0-13.05-4.09-15.89-10.01H2.69C1.22,25.24,0,24.18,0,22.89V12.35C0,11.06,1.21,10,2.69,10h43.37c2.84-5.92,8.89-10,15.89-10c7,0,13.05,4.09,15.89,10h41.69C121.02,10,122.23,11.06,122.23,12.35L122.23,12.35L122.23,12.35z M49.57,112.88c-2.84,5.92-8.89,10-15.9,10c-7,0-13.05-4.08-15.89-10l-15.09,0c-1.48,0-2.69-1.06-2.69-2.35V99.99c0-1.29,1.21-2.35,2.69-2.35l15.09,0c2.84-5.92,8.89-10.01,15.89-10.01c7,0,13.05,4.09,15.89,10.01h69.97c1.48,0,2.69,1.06,2.69,2.35v10.54c0,1.29-1.22,2.35-2.69,2.35L49.57,112.88L49.57,112.88z M104.12,69.73c-2.84,5.92-8.89,10.01-15.89,10.01c-7,0-13.05-4.09-15.9-10.01H2.69C1.22,69.73,0,68.67,0,67.38V56.85c0-1.29,1.21-2.35,2.69-2.35h69.64c2.84-5.92,8.89-10,15.89-10c7,0,13.05,4.09,15.89,10h15.42c1.48,0,2.69,1.06,2.69,2.35v10.53c0,1.29-1.21,2.35-2.69,2.35H104.12L104.12,69.73z"
                      />
                  </g>
              </svg>
             {isExpanded?('Gate Control'):('')}
          </div>
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="/user/viewanalytics" className="nav-link">
           <div className="userIinnerNavbar" style={{width: "90%"}}>
            <svg  style={{width:'1.4rem'}} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.42 122.88">
            <title>bar-chart</title>
            <path fill="#ffff"  d="M65.62,14.08H85.85a2,2,0,0,1,2,2V95.56a2,2,0,0,1-2,2H65.62a2,2,0,0,1-2-2V16a2,2,0,0,1,2-2Zm69.8,108.8H9.93v0A9.89,9.89,0,0,1,0,113H0V0H12.69V110.19H135.42v12.69ZM103.05,53.8h20.23a2,2,0,0,1,2,2V95.56a2,2,0,0,1-2,2H103.05a2,2,0,0,1-2-2V55.75a2,2,0,0,1,2-2ZM28.19,29.44H48.42a2,2,0,0,1,1.95,1.95V95.56a2,2,0,0,1-1.95,2H28.19a2,2,0,0,1-2-2V31.39a2,2,0,0,1,2-1.95Z"/>
           </svg>
             {isExpanded?('Monthly Analytics'):('')}
            </div>
          </NavLink>
        </div>

      </div>
    </>
  );
}

export default UserSidebar;