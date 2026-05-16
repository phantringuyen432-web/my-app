import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {

  const [form, setForm] = useState({

    username: "",
    email: "",
    password: ""

  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  // =========================
  // HANDLE REGISTER
  // =========================
  const handleRegister = async () => {

    // validate
    if (
      !form.username ||
      !form.email ||
      !form.password
    ) {

      toast.warning("Vui lòng nhập đầy đủ thông tin");

      return;

    }

    try {

      setLoading(true);

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

      // lỗi từ server
      if (!res.ok) {

        toast.warning(data.message || "Đăng ký thất bại");

        setLoading(false);

        return;

      }

      // thành công
      toast.success(data.message);

      navigate("/verify", {

        state: {
          email: form.email
        }

      });

    } catch (err) {

      console.log(err);

      toast.error("Không thể kết nối server");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Đăng ký
        </h2>

        {/* USERNAME */}
        <input
          name="username"
          placeholder="Username"
          className="w-full mb-2 p-2 border rounded"
          value={form.username}
          onChange={handleChange}
        />

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={form.password}
          onChange={handleChange}
        />

        {/* LOGIN LINK */}
        <div className="text-center mb-3">

          <Link
            to="/login"
            className="text-gray-600 text-sm hover:text-blue-600 transition"
          >

            Đã có tài khoản?{" "}

            <span className="font-semibold text-blue-500 hover:underline">
              Đăng nhập ngay
            </span>

          </Link>

        </div>

        {/* BUTTON */}
        <button

          onClick={handleRegister}

          disabled={loading}

          className={`

            w-full
            text-white
            py-2
            rounded

            ${
              loading
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }

          `}

        >

          {
            loading
              ? "Đang đăng ký..."
              : "Đăng ký"
          }

        </button>

      </div>

    </div>

  );

};

export default Register;