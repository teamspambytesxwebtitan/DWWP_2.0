import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig'; // Ensure the Firestore import is correct

import '../allCss/countdownTimer.css';

const Hello = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Fetch the current month from Firestore
  useEffect(() => {
    const fetchCurrentMonth = async () => {
      try {
        const monthDoc = await firestore.collection('settings').doc('currentMonth').get();
        if (monthDoc.exists) {
          setCurrentMonth(monthDoc.data().currentMonth);
        }
      } catch (error) {
        console.error('Error fetching current month:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMonth();
    calculateDaysRemaining();
  }, []);

  // Handle month selection change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Save the new current month and move data
  const saveCurrentMonth = async () => {
    if (!selectedMonth) {
      alert('Please select a month before saving.');
      return;
    }

    try {
      const selectedIndex = months.indexOf(selectedMonth);

      // Move data from the current month to the last zero-valued month before the selected month
      await moveDataToLastZeroMonth(selectedIndex);

      // Update Firestore with the new current month
      await firestore.collection('settings').doc('currentMonth').set({
        currentMonth: selectedMonth,
      });

      alert(`Current month successfully updated to ${selectedMonth}`);
      setCurrentMonth(selectedMonth);
    } catch (error) {
      console.error('Error saving current month:', error);
    }
  };

  // Function to move data from current month to the last zero-valued month
  const moveDataToLastZeroMonth = async (selectedIndex) => {
    try {
      const userDocs = await firestore.collection('users').get();

      userDocs.forEach(async (doc) => {
        const userData = doc.data();
        const usageData = userData.usage; // Assuming there's a 'usage' array

        // Check for the last zero-valued month before the selected month
        for (let i = selectedIndex - 1; i >= 0; i--) {
          if (usageData[i] === 0) {
            usageData[i] = userData[currentMonth];  // Move current month's data to the zero month
            break;
          }
        }

        // Update the user data with the modified usage array
        await firestore.collection('users').doc(doc.id).update({
          usage: usageData,
        });
      });
    } catch (error) {
      console.error('Error moving data to last zero-valued month:', error);
    }
  };

  // Calculate the number of days remaining until the next month
  const calculateDaysRemaining = () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const diffTime = Math.abs(lastDayOfMonth - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="month-selection-container">
      <div className="glass-card-22">
        <h2>Select Current Month</h2>
        <select
          className="month-dropdown"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="" disabled>Select a month</option>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        <button className="save-button" onClick={saveCurrentMonth}>
          Save as Current Month
        </button>
      </div>
      <div className="timer">
        <p>Days remaining until next month: {daysRemaining}</p>
      </div>
    </div>
  );
};

export default Hello;
