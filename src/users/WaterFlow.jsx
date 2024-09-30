import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Adjust the path as necessary
import { doc, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
import '../allCss/waterflow.css';

const WaterFlow = ({ userId }) => {
  const [totalUsage, setTotalUsage] = useState(0);
  const [penaltyPrice, setPenaltyPrice] = useState(0);
  const [regularPrice, setRegularPrice] = useState(0);
  const [regularLimit, setRegularLimit] = useState(100); // Regular limit set to 100 liters
  const [penaltyLimit, setPenaltyLimit] = useState(150); // Penalty limit set to 150 liters

  const [loading, setLoading] = useState(true); // Loading state

  // States to track if each data point has been fetched
  const [isWaterFlowFetched, setIsWaterFlowFetched] = useState(false);
  const [isPriceFetched, setIsPriceFetched] = useState(false);
  const [isLimitFetched, setIsLimitFetched] = useState(false);

  useEffect(() => {
    // Listener for waterflowSensor
    const unsubscribeWaterFlow = onSnapshot(
      doc(db, 'users', userId, 'currentMonth', 'waterflowSensor'),
      (waterFlowDocSnap) => {
        if (waterFlowDocSnap.exists()) {
          setTotalUsage(waterFlowDocSnap.data().totalusages || 0);
          setIsWaterFlowFetched(true);
          console.log("Water usage updated:", waterFlowDocSnap.data().totalusages || 0);
        } else {
          console.log("No such waterflowSensor document!");
          setIsWaterFlowFetched(true); // Even if document doesn't exist, consider it fetched
        }
      },
      (error) => {
        console.error("Error fetching waterflowSensor document: ", error);
        setIsWaterFlowFetched(true); // Prevent indefinite loading on error
      }
    );

    // Listener for price
    const unsubscribePrice = onSnapshot(
      doc(db, 'admin', 'price'),
      (priceDocSnap) => {
        if (priceDocSnap.exists()) {
          const data = priceDocSnap.data();
          setPenaltyPrice(data.penaltyPrice || 0);
          setRegularPrice(data.regularPrice || 0);
          setIsPriceFetched(true);
          console.log("Prices fetched:", data);
        } else {
          console.log("No such price document!");
          setIsPriceFetched(true); // Even if document doesn't exist, consider it fetched
        }
      },
      (error) => {
        console.error("Error fetching price document: ", error);
        setIsPriceFetched(true); // Prevent indefinite loading on error
      }
    );

    // Listener for limit
    const unsubscribeLimit = onSnapshot(
      doc(db, 'admin', 'limit'),
      (limitDocSnap) => {
        if (limitDocSnap.exists()) {
          const data = limitDocSnap.data();
          setPenaltyLimit(data.penalty || 150);
          setRegularLimit(data.regular || 100);
          setIsLimitFetched(true);
          console.log("Limits fetched:", data);
        } else {
          console.log("No such limit document!");
          setIsLimitFetched(true); // Even if document doesn't exist, consider it fetched
        }
      },
      (error) => {
        console.error("Error fetching limit document: ", error);
        setIsLimitFetched(true); // Prevent indefinite loading on error
      }
    );

    // Cleanup the listeners when the component unmounts
    return () => {
      unsubscribeWaterFlow();
      unsubscribePrice();
      unsubscribeLimit();
    };
  }, [userId]);

  useEffect(() => {
    // Check if all data has been fetched
    if (isWaterFlowFetched && isPriceFetched && isLimitFetched) {
      setLoading(false);
    }
  }, [isWaterFlowFetched, isPriceFetched, isLimitFetched]);

  // Calculate the regular usage and penalty usage
  const regularUsage = Math.min(totalUsage, regularLimit);
  const penaltyUsage = totalUsage > regularLimit ? totalUsage - regularLimit : 0;

  const regularPriceTotal = regularUsage * regularPrice;
  const penaltyPriceTotal = penaltyUsage * penaltyPrice;
  const totalPrice = regularPriceTotal + penaltyPriceTotal;

  return (
    <div className="waterflow-container">
      <header className="waterflow-header">
        <h1>Water Usage for This Month</h1>
      </header>
      {loading ? (
        <div className="loading-container">
          <p className="load">Loading...</p>
        </div>
      ) : (
        <div className="before-main">
          <p className='usages-title'><strong>Total Usage (liters):</strong> {totalUsage}</p>
          <main className="waterflow-main">
            {/* Regular Price Section */}
            <div className="price-row">
              <div className="price-box regular">
                <h2>Regular Price : {regularPrice} ₹/L</h2><hr/>
                <p className="usage-regular"><strong>Price for {regularUsage} liters:</strong> ₹{regularPriceTotal.toFixed(2)}</p>
              </div>
              <div className="price-box penalty">
                <h2>Penalty Price :  {penaltyPrice} ₹/L </h2><hr/>
                <p className="usage-penalty"><strong>Penalty for {penaltyUsage} liters:</strong> ₹{penaltyPriceTotal.toFixed(2)}</p>
              </div>
            </div>

            {/* Total Price */}
            <div className="total-price">
              <p>Total Price ₹{totalPrice.toFixed(2)}</p>
            </div>       
          </main> 
        </div>
      )}
    </div>
  );
};

export default WaterFlow;
