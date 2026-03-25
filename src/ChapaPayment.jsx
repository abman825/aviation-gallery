import React, { useState } from 'react';
import axios from 'axios';

const ChapaPayment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // ሊንኩን እዚህ ጋር በትክክል እናስተካክላለን
      const baseUrl = import.meta.env.VITE_API_URL || 'https://aviation-backend-g75i.onrender.com';
      
      const response = await axios.post(`${baseUrl}/api/pay`, {
        amount: "500",
        email: "abrham@example.com",
        first_name: "Customer",
        last_name: "Name",
        tx_ref: `tx-lilmoo-${Date.now()}`
      });

      if (response.data.status === 'success') {
        window.location.href = response.data.data.checkout_url;
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("ክፍያ መጀመር አልተቻለም! እባክዎ የባክኤንድ ሊንኩን ያረጋግጡ።");
    } finally {
      setLoading(false);
    }
  }; // <--- የ handlePayment ፈንክሽን እዚህ ጋር መዘጋት አለበት

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2 style={{ color: '#e91e63' }}>ጠቅላላ ክፍያ: 500 ETB</h2>
      <button 
        onClick={handlePayment} 
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#2ecc71',
          color: 'white', padding: '15px 30px', fontSize: '18px', border: 'none',
          borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', fontWeight: 'bold'
        }}
      >
        {loading ? 'በመጠበቅ ላይ...' : 'አሁን በቴሌብር ይክፈሉ'}
      </button>
    </div>
  );
};

export default ChapaPayment;