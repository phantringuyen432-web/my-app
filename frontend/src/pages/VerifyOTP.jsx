import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //lấy email từ Register
  const emailFromRegister = location.state?.email || "";

  const [email, setEmail] = useState(emailFromRegister);
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    fetch("https://my-app-ne36.onrender.com/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);

        // 🔥 nếu thành công → về login
        if (data.message.includes("thành công")) {
          navigate("/login");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80 text-center">

        <h2 className="text-xl font-bold mb-4">Xác nhận OTP</h2>

        <input
          value={email}
          readOnly
          className="w-full mb-2 p-2 border rounded bg-gray-100"
        />

        <input
          placeholder="Nhập OTP"
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Xác nhận
        </button>

      </div>
    </div>
  );
};

export default VerifyOTP;