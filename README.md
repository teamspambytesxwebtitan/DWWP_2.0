# Domestic Water Wastage Prevention System

An IoT-based solution for intelligent water management with real-time monitoring, automated control, and cloud integration. The system operates seamlessly in both online and offline modes while maintaining data integrity.

# Real-World Problems Solved by the Domestic Water Wastage Prevention (DWWP) System
1️. Uncontrolled Water Wastage in Households
Problem: Many households waste water due to negligence, leaks, or excessive usage.

Solution: The system monitors water flow in real-time and automatically shuts off supply when excessive usage is detected, preventing wastage.

2️. Overuse of Water Beyond Set Limits
Problem: Without a tracking system, people unknowingly exceed their monthly water limit.

Solution: The system enforces limit-based supply, alerting users when consumption nears the limit and cutting off supply if necessary.

3️. Leaks & Pipe Bursts Going Undetected
Problem: Water leakage from pipes, taps, or tanks often remains unnoticed, causing huge water loss.

Solution: The real-time water monitoring system detects irregular flow patterns and notifies users instantly to take action.

4️. Unfair Water Distribution in Shared Communities
Problem: In apartments or gated communities, some residents overconsume water, leaving others with shortages.

Solution: The system ensures fair distribution by allocating water based on individual limits, preventing excessive use by any one household.

5️. Lack of Remote Water Control
Problem: If a user forgets to turn off taps or needs to stop the supply while away from home, manual control is impossible.

Solution: With IoT-based remote access, users can control water supply from their smartphone, ensuring no wastage even when not at home.

6️. No Incentive for Water Conservation
Problem: People often don’t realize how much water they are consuming and lack motivation to save it.

Solution: The system provides real-time usage statistics, showing how much water is consumed daily, encouraging mindful consumption.

7️. Payment & Billing Inconvenience
Problem: Traditional water billing systems are based on fixed tariffs or post-usage bills, which can be unpredictable.

Solution: The Razorpay-integrated payment system allows users to top-up extra water instantly, avoiding billing surprises.

8️. Poor Water Management in Water-Scarce Areas
Problem: In drought-prone regions, excessive water use depletes resources rapidly, leading to shortages.

Solution: The system ensures equitable water distribution and prevents excessive extraction, making water usage more sustainable.

9️. Inefficient Emergency Water Supply Handling
Problem: During a sudden shortage, users must manually request water, causing delays.

Solution: The system allows for instant top-ups, ensuring users can get extra water immediately without waiting for manual approvals.

10. Lack of Data for Water Conservation Policies
Problem: Governments and municipalities struggle to collect accurate water usage data to plan conservation policies.

---

## Table of Contents
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Core Technologies](#core-technologies)
- [Hardware Components](#hardware-components)
- [Firebase Data Structure](#firebase-data-structure)
- [Installation & Setup](#installation--setup)
- [Operational Workflow](#operational-workflow)
- [License](#license)
- [Contributors](#contributors)

---

## Key Features

- **Role-Based Access Control**  
  **Admin**:  
  - Configure system-wide water limits and pricing  
  - Monitor all user activities and usage patterns  
  - Manage admin privileges and system settings  
  - Force emergency shutdown of water supply  
  
  **Users**:  
  - View real-time consumption metrics  
  - Receive personalized alerts and notifications  
  - Recharge water limits through integrated payments  
  - Access historical usage data  

- **Hybrid Operation Mode**  
  Seamless transition between online/offline modes with local data caching
- **Automated Water Control**  
  Servo-actuated valve management based on usage thresholds
- **Time-Synchronized Logging**  
  NTP server synchronization for accurate daily record-keeping
- **Smart Notifications**  
  **OLED Display**: Real-time system status and alerts  
  Audio/visual alerts for usage limits and system status
- **Payment Integration**  
  Razorpay-powered recharge system with transaction tracking

---


## System Architecture

### Hardware Subsystem
- **Sensing Layer**: Flow sensors for real-time water monitoring
- **Control Layer**: ESP32-based actuator management
- **Visual Interface**: 0.96" OLED display for status updates
- **Power Management**: Battery backup with TP4056 protection
- **User Interface**: Audio alerts via DF Mini MP3 module

---

## Hardware Components

| Component               | Specification                  |
|-------------------------|--------------------------------|
| Microcontroller         | ESP32-WROOM-32D               |
| Flow Sensor             | YF-S201 Hall Effect Sensor    |
| Display Module          | SSD1306 0.96" OLED            |
| Actuator                | SG90 Servo Motor              |
| Audio Module            | DF Mini MP3 Player            |
| Power Management        | TP4056 + 1200mAh Li-ion       |
| Storage                 | MicroSD Card (16GB)           |

---

### Software Subsystem
- **Edge Computing**: Local decision-making using Preferences storage
- **Cloud Integration**: Firebase Firestore for centralized data management
- **Time Synchronization**: NTP client for accurate timestamping
- **Dashboard**: React-based visualization and control interface

---

## Core Technologies

- **Frontend**: React 18 + Chart.js + Vite
- **Backend**: Firebase Firestore + Authentication
- **IoT Platform**: ESP32 (Arduino Core)
- **Payment Gateway**: Razorpay API
- **Time Service**: NTP Client Library


    

---

## Firebase Data Structure

```plaintext
users/ [Collection]
└── {userEmail}/ [Document]
    ├── servoState: boolean
    ├── lastSeen: timestamp
    ├── notification: string
    ├── userDetails: array
    └── monthlyUsages/ [Subcollection]
        └── {YYYY-MM}/ [Document]
            ├── isMonthFinish: boolean
            ├── limitExceeded: boolean
            ├── dailyUsage: map<date, number>
            ├── limit: number
            └── payment/ [Subcollection]
                └── payment_Details:
                    ├── paid: boolean
                    ├── date: string
                    └── id: string
            └── addon/ [Subcollection]
                └── addon_details:
                    ├── added-limit: number
                    └── used: number
```

---

## Installation & Setup

1. Clone repository:
```bash
git clone https://github.com/your-username/water-management-system.git
cd water-management-system
```

2. Configure Firebase:
```javascript
// src/firebase/config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
```

3. Install dependencies:
```bash
npm install
cd functions && npm install
```

---

## Operational Workflow

### Hardware Operation
1. **Data Acquisition**  
   - Flow sensors capture real-time usage data
   - ESP32 processes readings at 1Hz sampling rate

2. **Edge Processing**  
   - Local storage maintains last-known states (servo position/usage limits)
   - Offline mode uses cached values when internet unavailable

3. **Time Synchronization**  
   - Daily NTP server sync ensures accurate timestamps
   - Midnight flush of daily usage to Firestore

### Software Workflow
1. **State Management**  
![Alt Text](image.png)

   F -->|No| H[Maintain State]
   ```

2. **Data Synchronization**  
   - Periodic Firebase sync (15min intervals)
   - Conflict resolution prioritizes cloud data

3. **Payment Handling**  
   - Razorpay integration triggers Firestore updates
   - Successful payments increment usage limits

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---


---



