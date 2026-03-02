import axios from "axios";

export default function DummyCheckout({ orderId }) {

  const handlePayment = async (status) => {
    const { data } = await axios.post(
      "http://localhost:5000/api/payment/dummy",
      {
        orderId,
        status,
      }
    );

    if (data.success) {
      alert("Payment " + status);
    }
  };

  return (
    <div>
      <h2>Dummy Payment Gateway</h2>

      <button onClick={() => handlePayment("Paid")}>
        Pay Successfully ✅
      </button>

      <button onClick={() => handlePayment("Failed")}>
        Fail Payment ❌
      </button>
    </div>
  );
}
