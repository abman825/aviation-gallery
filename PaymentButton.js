import React, { useState } from 'react';
import axios from 'axios';

const LilmooPayment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    // 1. የክፍያ መረጃዎችን ማዘጋጀት
    const paymentData = {
      // ያንተ Test Public Key (ከፎቶው ላይ የተወሰደ)
      public_key: 'CHAPUBK_TEST-rnl2jvRBPJvcH3mSmANq7x9b5aWSFM2o', 
      amount: '500', // የልብሱ ዋጋ (ለምሳሌ 500 ብር)
      currency: 'ETB',
      email: 'abrhamman825@gmail.com', // ያንተ ኢሜይል
      first_name: 'Abraham',
      last_name: 'WebDev',
      tx_ref: `lilmoo-${Date.now()}`, // ለየብቻ የሆነ መለያ ቁጥር
      callback_url: 'https://webhook.site/test', // ክፍያው ሲያልቅ መረጃ የሚላክበት
      return_url: 'http://localhost:3000', // ክፍያው ሲያልቅ ደንበኛው የሚመለስበት ገጽ
      customization: {
        title: 'Lilmoo Design Payment',
        description: 'ለገዙን እናመሰግናለን!'
      }
    };

    try {
      // 2. ለ Chapa API መረጃውን መላክ
      // ማሳሰቢያ፡ በሪአክት ብቻ ስትሞክር "CORS error" ካመጣብህ ሰርቨር (Node.js) ያስፈልገናል
      const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', paymentData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        // 3. ደንበኛውን ወደ ቴሌብር/ባንክ መክፈያ ገጽ መውሰድ
        window.location.href = response.data.data.checkout_url;
      }
    } catch (error) {
      console.error("የክፍያ ስህተት፡", error.response ? error.response.data : error.message);
      alert("ክፍያውን መጀመር አልተቻለም። እባክህ ድጋሚ ሞክር!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{ color: '#e91e63' }}>Lilmoo Design Checkout</h2>
      <p>ጠቅላላ ክፍያ: 500 ETB</p>
      
      <button 
        onClick={handlePayment} 
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#2ecc71',
          color: 'white',
          padding: '15px 30px',
          fontSize: '18px',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: '0.3s'
        }}
      >
        {loading ? 'በመጠበቅ ላይ...' : 'አሁን በቴሌብር ይክፈሉ'}
      </button>
    </div>
  );
};

export default LilmooPayment;