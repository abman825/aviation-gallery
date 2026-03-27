const handlePayment = async () => {
    setLoading(true);
    try {
      // በትክክለኛው ሰርቨር መተካቱን እርግጠኛ ሁን
      const baseUrl = "https://aviation-backend-g75i.onrender.com"; 
      
      const response = await axios.post(`${baseUrl}/api/pay`, {
        amount: "500",
        email: "abrham@example.com", // እዚህ ጋር የደንበኛውን ኢሜል ከ Form መቀበል ትችላለህ
        first_name: "Customer",
        last_name: "Name",
        tx_ref: `tx-lilmoo-${Date.now()}`
      });

      // Chapa 'success' ሲመልስ ወደ ክፍያ ገጽ ይወስደዋል
      if (response.data && response.data.status === 'success') {
        window.location.href = response.data.data.checkout_url;
      } else {
        alert("የክፍያ መረጃ ማግኘት አልተቻለም!");
      }
    } catch (error) {
      console.error("Payment Error:", error.response ? error.response.data : error.message);
      alert("ክፍያ መጀመር አልተቻለም! Backend ሰርቨሩ ላይ CHAPA_SECRET_KEY መኖሩን አረጋግጥ።");
    } finally {
      setLoading(false);
    }
};