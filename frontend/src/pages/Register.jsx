import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const handleRegister = async () => {

  try {

    const res = await fetch(
      "https://my-app-ne36.onrender.com/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form)
      }
    );

    const data = await res.json();

    console.log(data);

    // nếu lỗi
    if (!res.ok) {

      alert(data.message || "Đăng ký thất bại");

      return;
    }

    alert(data.message);

    // thành công mới chuyển trang
    navigate("/verify", {
      state: {
        email: form.email
      }
    });

  } catch (err) {

    console.log(err);

    alert("Lỗi kết nối server");

  }

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Đăng ký</h2>

        <input
          name="username"
          placeholder="Username"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
        />
        <div className="text-center mb-2">
            <Link
                to="/login"
                className="text-gray-600 text-sm hover:text-blue-600 transition"
            >
                Đã có tài khoản {" "}
                <span className="font-semibold text-blue-500 hover:underline">
                    Đăng nhập ngay
                </span>
            </Link>
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default Register;