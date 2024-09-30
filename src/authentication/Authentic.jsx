import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Adjust import as needed
import '../allCss/authentic.css'; // Adjust CSS path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebaseConfig'; // Adjust import as needed

const Authentic = () => {
   const [isUserLogin, setIsUserLogin] = useState(true);
   const [isLoginMode, setIsLoginMode] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate(); // Hook to navigate between routes

   const handleToggleRole = () => setIsUserLogin(!isUserLogin);
   const handleToggleMode = () => setIsLoginMode(!isLoginMode);

   const handleLogin = async () => {
      try {
         await signInWithEmailAndPassword(auth, email, password);
         
         // Check if the user is an admin
         const adminDocRef = doc(db, 'admin', '01ListOfAdmin'); // Adjust the path as necessary
         const adminDoc = await getDoc(adminDocRef);

         if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            const isAdmin = adminData.admins.includes(email); // Check if the email is in the admins array

            // Throw error if user selects wrong role
            if (isUserLogin && isAdmin) {
               setError('This account belongs to an admin. Please select Authority to log in.');
            } else if (!isUserLogin && !isAdmin) {
               setError('This account belongs to a user. Please select User to log in.');
            } else {
               // Navigate based on role
               navigate(isUserLogin ? "/user/waterflow" : "/admin/setlimit");
            }
         } else {
            // Handle the case where the admin document doesn't exist
            console.error("Admin document does not exist.");
            navigate("/user/waterflow"); // Redirect to user page as a fallback
         }
      } catch (error) {
         setError(`Login Error: ${error.message}`);
      }
   };

   const handleRegister = async () => {
      try {
         // Create a new user in Firebase Authentication
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         const userId = userCredential.user.uid; // Get the new user's UID
   
         // Create the user document in Firestore
         const userDocRef = doc(db, 'users', email); // Use email as the document ID
         await setDoc(userDocRef, {});
   
         // Create subcollections and documents for currentMonth, jan24, feb24, etc.
         const collections = ['currentMonth', 'jan24', 'feb24']; // Add more months as needed
         for (const collection of collections) {
            const servoControlDocRef = doc(db, 'users', email, collection, 'servoControl');
            const waterflowSensorDocRef = doc(db, 'users', email, collection, 'waterflowSensor');
   
            // Initialize servoControl and waterflowSensor documents
            await setDoc(servoControlDocRef, { servoState: 0 }); // Default state
            await setDoc(waterflowSensorDocRef, { totalusages: 0 }); // Default usage
         }

         // Redirect the user
         navigate(isUserLogin ? "/user/waterflow" : "/admin/setlimit");
      } catch (error) {
         if (error.code === 'auth/email-already-in-use') {
            setError('This email is already in use. Please use a different email.');
         } else {
            setError(`Registration Error: ${error.message}`);
         }
      }
   };

   const handleGoogleLogin = async () => {
      const provider = new GoogleAuthProvider();
      try {
         await signInWithPopup(auth, provider);
         
         // Check if the user is an admin
         const adminDocRef = doc(db, 'admin', '01ListOfAdmin'); // Adjust the path as necessary
         const adminDoc = await getDoc(adminDocRef);

         if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            const isAdmin = adminData.admins.includes(email); // Check if the email is in the admins array

            // Throw error if user selects wrong role
            if (isUserLogin && isAdmin) {
               setError('This account belongs to an admin. Please select Authority to log in.');
            } else if (!isUserLogin && !isAdmin) {
               setError('This account belongs to a user. Please select User to log in.');
            } else {
               // Navigate based on role
               navigate(isUserLogin ? "/user/waterflow" : "/admin/setlimit");
            }
         } else {
            console.error("Admin document does not exist.");
            navigate("/user/waterflow"); // Redirect to user page as a fallback
         }
      } catch (error) {
         setError(`Google Login Error: ${error.message}`);
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-header">
            <button className={`role-button ${isUserLogin ? 'active' : ''}`} onClick={handleToggleRole}>
               User
            </button>
            <button className={`role-button ${!isUserLogin ? 'active' : ''}`} onClick={handleToggleRole}>
               Authority
            </button>
         </div>
         <div className="auth-card">
            <h1>{isUserLogin ? (isLoginMode ? "User Login" : "User Register") : (isLoginMode ? "Authority Login" : "Authority Register")}</h1>
            <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Email"
               className="auth-input"
            />
            <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Password"
               className="auth-input"
            />
            {error && <p className="error-message">{error}</p>}
            {isLoginMode ? (
               <>
                  <button onClick={handleLogin} className="auth-button">Login</button>
                  <button onClick={handleGoogleLogin} className="google-button">Sign in with Google</button>
                  {isUserLogin && (
                     <p style={{color:"white"}}>Don't have an account? <button onClick={handleToggleMode} className="toggle-button">Register</button></p>
                  )}
               </>
            ) : (
               <>
                  <button onClick={handleRegister} className="auth-button">Register</button>
                  <button onClick={handleGoogleLogin} className="google-button"> Sign up with Google</button>
                  <p style={{color:"white"}}>Already have an account? <button onClick={handleToggleMode} className="toggle-button">Login</button></p>
               </>
            )}
         </div>
      </div>
   );
   
};

export default Authentic;
