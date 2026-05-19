import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // HANDLE CHANGE
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  // HANDLE LOGIN
  const handleLogin = async () => {

    // validate
    if (!form.email || !form.password) {

      toast.warning("Vui lòng nhập đầy đủ thông tin");

      return;

    }

    try {

      setLoading(true);

      const res = await fetch(
        "https://my-app-ne36.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      // LOGIN SUCCESS
      if (data.token) {

        // save token
        localStorage.setItem(
          "token",
          data.token
        );

        // save user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        toast.success("Đăng nhập thành công");

        // admin
        if (data.user.role === "admin") {

          navigate("/admin");

        }

        // user
        else {

          navigate("/");

        }

      }

      // LOGIN FAIL
      else {

        toast.error(
          data.message || "Đăng nhập thất bại"
        );

      }

    } catch (err) {

      console.log(err);

      toast.error("Lỗi server");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          🔐 Đăng nhập
        </h2>

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Nhập email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* REGISTER */}
        <div className="text-center mb-5">

          <Link
            to="/register"
            className="text-gray-600 text-sm hover:text-blue-600 transition"
          >

            Chưa có tài khoản?{" "}

            <span className="font-semibold text-blue-500 hover:underline">

              Đăng ký ngay

            </span>

          </Link>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`
            w-full py-3 rounded-xl text-white font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }
          `}
        >

          {loading
            ? "Đang đăng nhập..."
            : "Đăng nhập"}

        </button>

      </div>

    </div>

  );

};

export default Login;