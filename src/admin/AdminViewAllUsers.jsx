import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import '../allCss/adminViewAllUser.css'; 

const AdminDashboard = () => {
  const [allUsersData, setAllUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);

      const allUsersData = [];

      // Iterate through each user document
      querySnapshot.forEach((doc) => {
        allUsersData.push({
          userId: doc.id,
        });
      });

      return allUsersData;
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Fetch a specific user's data for a given month
  const fetchUserDataForMonth = async (userId, month) => {
    try {
      const servoControlDocRef = doc(db, 'users', userId, month, 'servoControl');
      const waterFlowDocRef = doc(db, 'users', userId, month, 'waterflowSensor');

      const [servoControlSnap, waterFlowSnap] = await Promise.all([
        getDoc(servoControlDocRef),
        getDoc(waterFlowDocRef),
      ]);

      return {
        servoState: servoControlSnap.exists() ? servoControlSnap.data().servoState : 'No Data',
        totalUsage: waterFlowSnap.exists() ? waterFlowSnap.data().totalusages : 'No Data',
      };
    } catch (error) {
      console.error("Error fetching user's monthly data: ", error);
    }
  };

  // Fetch data for all users
  const fetchAllUsersData = async () => {
    try {
      const allUsers = await fetchAllUsers();

      const allUsersDataWithDetails = await Promise.all(
        allUsers.map(async (user) => {
          const currentMonthData = await fetchUserDataForMonth(user.userId, 'currentMonth');
          const jan24Data = await fetchUserDataForMonth(user.userId, 'jan24');
          const feb24Data = await fetchUserDataForMonth(user.userId, 'feb24');

          return {
            userId: user.userId,
            currentMonth: currentMonthData,
            jan24: jan24Data,
            feb24: feb24Data,
          };
        })
      );

      setAllUsersData(allUsersDataWithDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all users' data: ", error);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllUsersData();
  }, []);

  // Handler for viewing user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  // Filter users based on search query
  const filteredUsers = allUsersData.filter(user =>
    user.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>All Users Data</h1>
      </header>
      
      <main className="admin-dashboard-main">
      {loading ? (
        <div className="loading-container">
          <p className="load">Loading...</p>
        </div>
      ) : (
      <>
        <div className="search-bar-User">
          <input 
            type="text" 
            placeholder='Search by ID'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th>User ID</th>  
              <th>Current Month Usage</th>
              <th>January 2024 Usage</th>
              <th>February 2024 Usage</th>
              <th>Current Servo State</th>
              <th>Due Bill</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.currentMonth.totalUsage}</td>
                <td>{user.jan24.totalUsage}</td>
                <td>{user.feb24.totalUsage}</td>
                <td>{user.currentMonth.servoState === true ? 'On' : 'Off'}</td>
                <td>{user.currentMonth.totalUsage }</td>
                <td>
                  <button 
                    className='userViewDetails' 
                    onClick={() => handleViewDetails(user)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
      </main>

      {/* Modal for User Details */}
      {selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>User Details</h2>
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <div className="user-details">
              <p><strong>User ID:</strong> {selectedUser.userId}</p>
              
              <h3>Current Month</h3>
              <p><strong>Total Usage:</strong> {selectedUser.currentMonth.totalUsage}</p>
              <p><strong>Servo State:</strong> {selectedUser.currentMonth.servoState === true ? 'On' : 'Off'}</p>

              <h3>January 2024</h3>
              <p><strong>Total Usage:</strong> {selectedUser.jan24.totalUsage}</p>
              <p><strong>Servo State:</strong> {selectedUser.jan24.servoState === true ? 'On' : 'Off'}</p>

              <h3>February 2024</h3>
              <p><strong>Total Usage:</strong> {selectedUser.feb24.totalUsage}</p>
              <p><strong>Servo State:</strong> {selectedUser.feb24.servoState === true ? 'On' : 'Off'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
