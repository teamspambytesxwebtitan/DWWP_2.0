import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

  async function downloadPDF(usedWater) {

        if (!usedWater || isNaN(usedWater) || usedWater <= 0) {
            alert('Invalid water usage value for the last month.');
            return;
        }
        //here i have to implement the total price  bassed on limits 
        const regularLimit = adminData?.limit?.regular;
        const maxLimit = adminData?.limit?.max;
        const regularPrice = adminData?.price?.regularPrice;
        const penaltyPrice = adminData?.price?.penaltyPrice;

        if (regularLimit == null || maxLimit == null || regularPrice == null || penaltyPrice == null) {
            console.error("Admin data is incomplete or not loaded.");
            return 0;
        }
        let extraPrice22 = 0;
        let totalPrice22 = 0;
        let regularprice22 = 0 ;

        if (usedWater <= regularLimit) {
            totalPrice22 = usedWater * regularPrice; // Regular charge
            regularprice22 = totalPrice22 ;
            setTotalPrice(totalPrice22)
        } else if (usedWater > regularLimit && usedWater <= maxLimit) {
             let extraWater = usedWater - regularLimit; 
              extraPrice22 = extraWater * penaltyPrice; 
              regularprice22 = regularLimit * regularPrice ;
             totalPrice22 = extraPrice22 + regularprice22
        } else {
            console.warn("Usage exceeds max limit - additional charges may apply.");
            totalPrice22 = usedWater * penaltyPrice;
            setTotalPrice(totalPrice22)
        }
        const doc = new jsPDF();
        // Header section
        const logo = 'https://i.ibb.co/9hcFtsn/dwp-logo.png';
        doc.addImage(logo, 'PNG', 10, 10, 20, 20); // Add logo
        doc.setFontSize(18);
        doc.text("Domestic Water Wastage Prevention System", 40, 15);
        doc.setFontSize(12);
        doc.text("ONLINE BILL", 40, 25);
    
        // Bill Details Section
        doc.setFontSize(10);
        doc.text(`Bill Month: ${selectedMonth.month.toUpperCase().slice(0,3) + `_20` + selectedMonth.month.toUpperCase().slice(-2)}`, 10, 40);
        doc.text(`Consumer Name: ${userDetails[0]} `, 120, 40);
        doc.text(`Bill ID: ${selectedMonth.razorpay_payment_id}`, 10, 45);
        doc.text(`Contact No: ${userDetails[1]}`, 120, 45);
        doc.text(`Bill Date: ${selectedMonth.paid_date}`, 10, 50);
        doc.text(`Valid ID: ${userDetails[2]}`, 120, 50);
        doc.text(`Payment Status: ${selectedMonth.paid ? 'paid':'not paid'}`, 10, 55);
        doc.text(`Consumer Address: ${userDetails[3]}`, 120, 55);
    
        // Line separator
        doc.line(10, 60, 200, 60);
    
        // Reading Details Table
        doc.setFontSize(10);
        doc.text(`Payment Date: ${selectedMonth.paid_date}`, 10, 100);
        // doc.text("Reading", 60, 70);
        doc.text(`Consumption : ${selectedMonth.totalusages}`, 160, 100);
        doc.line(10, 72, 200, 72); // Header underline
    
        // Additional Amount Details Table
        // doc.text("Additional Amount Details", 10, 100);
        doc.line(10, 102, 200, 102);
        doc.text("Particulars", 10, 110);
        doc.text("Amount", 160, 110);
        doc.line(10, 112, 200, 112);
    
        // Sample rows for additional charges
        let yPosition = 120;
        const charges = [
            { name: "Fare Price", amount: `${regularprice22}` },
            { name: "Fine", amount: `${extraPrice22}` },
        ];
        charges.forEach(charge => {
            doc.text(charge.name, 10, yPosition);
            doc.text(charge.amount, 160, yPosition);
            yPosition += 10;
        });
    
        // Footer with Total
        doc.setFontSize(16);
        doc.text(`Total Amount: ${totalPrice22}`, 130, yPosition + 10 );
        doc.line(10, yPosition + 15, 200, yPosition + 15);
    
        // Authorized Signatory Section
        doc.setFontSize(10);
        doc.text("Authorized Signatory", 10, yPosition + 30);
        const ok = 'https://i.ibb.co/W67L2fK/pngwing-com.png';
        doc.addImage(ok, 'PNG', 50,yPosition + 25, 10, 10); 
    
        // Footer with Download Date
        const downloadDate = new Date().toLocaleDateString();
        doc.text(`Downloaded on: ${downloadDate}`, 150, yPosition + 30);
    
        // Save PDF
        doc.save("water_bill_receipt.pdf");
    }
    