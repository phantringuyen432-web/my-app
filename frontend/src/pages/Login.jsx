import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({
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

  const handleLogin = () => {
    fetch("https://my-app-ne36.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          // lưu token
          localStorage.setItem(
            "token",
            data.token
          );
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
          toast.success("Đăng nhập thành công");
          // admin
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          toast.error(
            data.message || "Đăng nhập thất bại"
          );
        }
      })
      .catch(err => {
        console.log(err);
        toast.error("Lỗi server");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Đăng nhập</h2>

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
            to="/register"
            className="text-gray-600 text-sm hover:text-blue-600 transition"
        >
            Chưa có tài khoản? {" "}
            <span className="font-semibold text-blue-500 hover:underline">
                Đăng ký ngay
            </span>
        </Link>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Login;