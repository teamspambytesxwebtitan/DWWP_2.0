import React, { useEffect } from "react";
import "./NotificationDropdown.css";
import { IoMdInformationCircle } from "react-icons/io";
const NotificationDropdown = ({ isOpen, onClose }) => {
  const notifications = [
          {
                    id: 1,
                    icon: "💦",
                    message: "Your Payment bill is ready, plase  have a look  .",
                    time: "2 hours ago",
                  },
                  {
                    id: 2,
                    icon: "fas fa-exclamation-triangle",
                    message: "Recharge of ₹50 of Qty 1 has been added to ypur account.",
                    time: "1 day ago",
                  },
                  {
                    id: 3,
                    icon: "fas fa-check-circle",
                    message: "Your payment of March 2025 was successful.",
                    time: "3 days ago",
                  },
                  {
                    id: 3,
                    icon: "fas fa-check-circle",
                    message: "Water Supply was discontinued due to exceed to limit , and will be restart in the next Month , Or you can recharge with any pack  .",
                    time: "3 days ago",
                  },
                  {
                    id: 3,
                    icon: "fas fa-check-circle",
                    message: "Your payment was successful.",
                    time: "3 days ago",
                  },
    // Add more notifications as needed
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".notification-dropdown") && !e.target.closest(".notification-icon")) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="user-notification-dropdown">
      <div className="user-notification-header">
        <h4>Notifications</h4>
        <button className="mark-all-read">Mark all as read</button>
      </div>
      <div className="user-notification-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="user-notification-item">
            <div className="user-notification-icon">
              <i className={notification.icon} />
            </div>
            <div className="user-notification-content">
              <p>{notification.message}</p>
              <span className="user-notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;