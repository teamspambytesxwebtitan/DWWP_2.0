export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const handlePayment = async (amount) => {
    const res = await loadRazorpayScript();
    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Ensure you have this in your .env file
        amount: amount * 100, // Razorpay requires amount in paise
        currency: "INR",
        name: "DWWP Payments",
        description: "Payment for water usage",
        image: "https://i.ibb.co/TDd24C9X/Domestic.png",
        handler: async function (response) {
            alert(`Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
            console.log("Payment successful:", response);
            // const paidDate = new Date().toLocaleDateString("en-GB"); 
            // const currentMonthRef = doc(db, 'users', userId, month, 'paidStatus');
            // try {
            //     await updateDoc(currentMonthRef, {
            //         paid: true, 
            //         paid_date: paidDate, 
            //         razorpay_payment_id: response.razorpay_payment_id 
            //     });
            // } catch (error) {
            //     console.error("Error updating document: ", error);
            // }
        },
        prefill: {
            name: "User Name",
            email: "user@example.com",
            contact: "8785559456",
        },
        theme: {
            color: "#1e293b", 
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
};
