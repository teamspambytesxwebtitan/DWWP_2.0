import React, { useState, useEffect } from 'react';

function Test() {
    const [ledState, setLedState] = useState(false);

  const toggleLED = () => {
    // Send POST request to ESP32 to toggle LED
    fetch("http://192.168.1.1/api/led", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ state: ledState ? "0" : "1" }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data); // Log server response
        setLedState(!ledState); // Toggle the LED state in the app
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="App">
      <h1>ESP32 LED Control</h1>
      <button onClick={toggleLED}>
        Turn LED {ledState ? "OFF" : "ON"}
      </button>
    </div>
  );
}
export default Test