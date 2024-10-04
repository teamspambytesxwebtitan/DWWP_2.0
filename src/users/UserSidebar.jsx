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
        <button className='expand-sidenavabr' style={{backgroundColor:'rebeccapurple'}} onClick={HandleExpansion}>{isExpanded ?(<div className='sidebar-close-button'>Close</div> ):(<div className='sidebar-open-button'>Open</div>)}</button>
      </div>
    </>
  );
}

export default UserSidebar;