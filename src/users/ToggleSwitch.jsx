import React, { useState , useEffect } from "react";
import { db } from '../firebaseConfig';  // Adjust the path as necessary
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';  // Import updateDoc for updating fields
import "./ToggleSwitch.css"; // Assuming you will add the CSS separately or inline.

const ToggleSwitch = ({userId}) => {
  if (!userId) {
    console.error("userId is undefined in ToggleSwitch");
    return null; // Don't render the component if userId is missing
  }

  const [servoState, setServoState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(true); // Default is checked
  
  const servoControlDocRef = doc(db, 'users', userId );

  const handleToggle = async () => {
    const newState = !servoState;
        // Prevent toggling on if usage exceeds max limit
        // if (newState && totalUsage >= maxLimit) {
        //   alert("Cannot turn on servo. Max water usage limit exceeded.");
        //   return;
        // }
    
     try {
          await updateDoc(servoControlDocRef, { servoState: newState });
          setServoState(newState);
          // console.log(`Servo state updated to: ${newState}`);
        } catch (error) {
          console.error("Error updating servoControl document: ", error);
        }
  };

    // useEffect(() => {
    //   // Monitor totalUsage and update servoState if necessary
    //   const checkUsageAndUpdateServo = async () => {
    //     if (totalUsage >= maxLimit && servoState) {
    //       try {
    //         await updateDoc(servoControlDocRef, { servoState: false });
    //         setServoState(false);
    //         // console.log("Max limit exceeded. Servo turned off.");
    //       } catch (error) {
    //         console.error("Error updating servoControl document: ", error);
    //       }
    //     }
    //   };
  
    //   checkUsageAndUpdateServo();
    // }, [totalUsage, maxLimit, servoState, servoControlDocRef]);
    
    
    useEffect(() => {
    // Fetch initial servo state and limits
    const fetchInitialData = async () => {
      try {
        const [servoSnap] = await Promise.all([
          getDoc(servoControlDocRef),
        ]);

        if (servoSnap.exists()) {
          setServoState(servoSnap.data().servoState);
          console.log(servoState);
          
        } else {
          console.log("No such servoControl document!");
        }
      } catch (error) {
        console.error("Error fetching initial data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Real-time listener for servoControl
    const unsubscribeServoControl = onSnapshot(servoControlDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setServoState(docSnap.data().servoState);
        // console.log("Servo state updated via Firestore:", docSnap.data().servoState);
      } else {
        console.log("No such servoControl document!");
      }
    });
      return () => {
        unsubscribeServoControl();
      };
    }, [userId, servoControlDocRef]);
console.log(userId);

  return (
    <div className="container"  >
      <label className="switch" >
        <input
          type="checkbox"
          className="togglesw"
          checked={!!servoState} 
          onChange={handleToggle} 
        />
        <div className={`indicator left ${servoState? 'active' : ''}`}></div>
        <div className={`indicator right ${!servoState ? 'active' : ''}`}></div>
        <div className={`button ${servoState ? 'active' : ''}`}></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;