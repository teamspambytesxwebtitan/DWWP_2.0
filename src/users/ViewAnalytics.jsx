import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Adjust the path as necessary
import { doc, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../allCss/viewAnalytics.css';  // Import your CSS for user page styling

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ViewAnalytics = ({ userId }) => {
  const [usageData, setUsageData] = useState({
    jan24: 0,
    feb24: 0,
    currentMonth: 0,
  });

  useEffect(() => {
    const unsubscribeJan24 = onSnapshot(doc(db, 'users', userId, 'jan24', 'waterflowSensor'), (jan24Snap) => {
      setUsageData(prev => ({
        ...prev,
        jan24: jan24Snap.exists() ? jan24Snap.data().totalusages : 0,
      }));
    });

    const unsubscribeFeb24 = onSnapshot(doc(db, 'users', userId, 'feb24', 'waterflowSensor'), (feb24Snap) => {
      setUsageData(prev => ({
        ...prev,
        feb24: feb24Snap.exists() ? feb24Snap.data().totalusages : 0,
      }));
    });

    const unsubscribeCurrentMonth = onSnapshot(doc(db, 'users', userId, 'currentMonth', 'waterflowSensor'), (currentMonthSnap) => {
      setUsageData(prev => ({
        ...prev,
        currentMonth: currentMonthSnap.exists() ? currentMonthSnap.data().totalusages : 0,
      }));
    });

    // Cleanup listeners when the component unmounts
    return () => {
      unsubscribeJan24();
      unsubscribeFeb24();
      unsubscribeCurrentMonth();
    };
  }, [userId]);

  const data = {
    labels: ['January 2024', 'February 2024', 'Current Month'],
    datasets: [
      {
        label: 'Total Water Usage (liters)',
        data: [usageData.jan24, usageData.feb24, usageData.currentMonth],
        fill: false,
        borderColor: '#4CAF50', // Green color for the line
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="view-analytics-container">
      {/* <header className="view-analytics-header">
        <h1>Water Usage Analytics for {userId}</h1>
      </header> */}
      
      <main className="view-analytics-main">
        <div className="chart-container">
          <Line data={data} />
        </div>
        
        <div className="data-list">
          <ul>
            <li><strong>January 2024:</strong> {usageData.jan24 !== null ? `${usageData.jan24} liters` : 'N/A'}</li>
            <li><strong>February 2024:</strong> {usageData.feb24 !== null ? `${usageData.feb24} liters` : 'N/A'}</li>
            <li><strong>Current Month:</strong> {usageData.currentMonth !== null ? `${usageData.currentMonth} liters` : 'N/A'}</li>
          </ul>
        </div>
      </main>
      
      {/* <footer className="view-analytics-footer">
        <p>&copy; {new Date().getFullYear()} WaterFlow Dashboard. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default ViewAnalytics;
