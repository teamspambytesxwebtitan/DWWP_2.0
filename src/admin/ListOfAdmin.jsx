import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust import as necessary
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../allCss/listofAdmin.css'; // Ensure this file is imported

const ListOfAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminDocRef = doc(db, 'admin', '01ListOfAdmin');
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          setAdmins(adminData.admins || []);
        } else {
          setError('Admin document does not exist.');
        }
      } catch (err) {
        setError('Failed to fetch admins.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchAdmins();
  }, []);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setNewEmail(admins[index]);
    setError(''); // Clear any existing errors
  };

  const handleSaveClick = async (index) => {
    if (!newEmail.trim()) {
      setError('Email cannot be empty.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const updatedAdmins = [...admins];
      updatedAdmins[index] = newEmail.trim();

      const adminDocRef = doc(db, 'admin', '01ListOfAdmin');
      await setDoc(adminDocRef, { admins: updatedAdmins });

      setAdmins(updatedAdmins);
      setEditIndex(null);
      setNewEmail('');
      setError('');
    } catch (err) {
      setError('Failed to update admin.');
      console.error(err);
    }
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setNewEmail('');
    setError('');
  };

  if (loading) {
    return <p  className='load' style={{  color: '#f5f5f5' }}>Loading ...</p>;
  }

  return (
    <div className="admin-list-container">
      <h1>Admin List</h1>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {admins.map((admin, index) => (
          <li key={index}>
            {editIndex === index ? (
              <div className="edit-mode">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="New Admin Email"
                />
                <button onClick={() => handleSaveClick(index)}>Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </div>
            ) : (
              <div className="admin-info">
                <span className="admin-email">{admin}</span>
                <button onClick={() => handleEditClick(index)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListOfAdmin;
