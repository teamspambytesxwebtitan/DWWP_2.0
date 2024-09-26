import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Adjust the path as necessary
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';  // Import onSnapshot for real-time updates
import '../allCss/servoControl.css';  // Import your CSS for user page styling

const ServoControl = ({ userId }) => {
  const [servoState, setServoState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalUsage, setTotalUsage] = useState(0); // Track total water usage
  const [maxLimit, setMaxLimit] = useState(200); // Assuming default max limit
  const [penaltyLimit, setPenaltyLimit] = useState(150);
  const [regularLimit, setRegularLimit] = useState(100);

  const servoControlDocRef = doc(db, 'users', userId, 'currentMonth', 'servoControl');
  const waterFlowDocRef = doc(db, 'users', userId, 'currentMonth', 'waterflowSensor'); // Reference for water usage
  const limitDocRef = doc(db, 'admin', 'limit'); // Assuming limit is stored in admin collection

  useEffect(() => {
    const fetchServoState = async () => {
      try {
        const docSnap = await getDoc(servoControlDocRef);
        if (docSnap.exists()) {
          setServoState(docSnap.data().servoState);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    const fetchLimits = async () => {
      try {
        const docSnap = await getDoc(limitDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMaxLimit(data.max || 200);
          setPenaltyLimit(data.penalty || 150);
          setRegularLimit(data.regular || 100);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching limits: ", error);
      }
    };

    // Real-time listener for water usage
    const unsubscribeWaterUsage = onSnapshot(waterFlowDocRef, (doc) => {
      if (doc.exists()) {
        setTotalUsage(doc.data().totalusages || 0); // Update total usage when Firestore data changes
      } else {
        console.log("No such document!");
      }
    });

    fetchServoState();
    fetchLimits();
    setLoading(false);

    // Cleanup subscription on unmount
    return () => unsubscribeWaterUsage();
  }, [userId]);

  const handleToggle = async () => {
    const newState = !servoState;
    try {
      await setDoc(servoControlDocRef, { servoState: newState });
      setServoState(newState);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Determine the bar color based on the total usage
  const getBarColor = () => {
    if (totalUsage < regularLimit) return '#90EE90'; // Green
    if (totalUsage >= regularLimit && totalUsage < maxLimit) return '#ffa756'; // Orange
    return 'red'; // Red
  };

  // Check if the usage exceeds the max limit
  const isUsageExceeded = totalUsage >= maxLimit;

  if (loading) return <p className='load'>Loading...</p>;

  return (
    <div className="servo-control-container">
      <header className="servo-control-header">
        <h1>Gate Control </h1>{userId}
      </header>
      
      <main className="servo-control-main">
        <p><strong>Current Gate Status:</strong> {servoState !== null ? (servoState ? 'On' : 'Off') : 'N/A'}</p>
        <p><strong>Total Water Usage:</strong> {totalUsage} liters</p> {/* Display total usage */}

        <div className="servo-control-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={servoState && !isUsageExceeded} // Disable switch if usage exceeds the max limit
              onChange={handleToggle}
              disabled={isUsageExceeded} // Disable switch if usage exceeds the max limit
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Progress Bar */}
        <div className="usage-bar" style={{ backgroundColor: getBarColor() }}>
          Usage: {totalUsage} liters
        </div>
      </main>
      
      <footer className="servo-control-footer">
        <p>&copy; {new Date().getFullYear()} WaterFlow Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ServoControl;
