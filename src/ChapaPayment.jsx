import React, { useState } from 'react';
import axios from 'axios';

const ChapaPayment = () => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        const baseUrl = "https://aviation-backend-g75i.onrender.com";

        try {
            // 1. ለ Backend የክፍያ ጥያቄ መላክ
            const response = await axios.post(`${baseUrl}/api/pay`, {
                amount: "500",
                email: "abrham@example.com", // እዚህ ጋር ከ Form የሚመጣውን ዳታ መጠቀም ትችላለህ
                first_name: "Customer",
                last_name: "Name",
                tx_ref: `tx-lilmoo-${Date.now()}`
            });

            // 2. ከ Chapa መልስ ሲመጣ ወደ ክፍያ ገጽ (Checkout) መውሰድ
            if (response.data && response.data.status === 'success') {
                window.location.href = response.data.data.checkout_url;
            } else {
                alert("የክፍያ መረጃ ማግኘት አልተቻለም! እባክዎ ድጋሚ ይሞክሩ።");
            }

        } catch (error) {
            // ስህተት ካለ እዚህ ይያዛል
            console.error("Payment Error:", error.response ? error.response.data : error.message);
            alert("ክፍያ መጀመር አልተቻለም! Backend ሰርቨሩ ላይ CHAPA_SECRET_KEY መኖሩን እና መስራቱን ያረጋግጡ።");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePayment} 
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded"
        >
            {loading ? "በመጫን ላይ..." : "አሁን ይክፈሉ"}
        </button>
    );
};

export default ChapaPayment;