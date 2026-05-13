import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cart from "../components/Cart";

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    //Nếu chưa login → chặn
    if (!user) {
      alert("⚠️ Bạn cần đăng nhập để xem giỏ hàng!");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng</h1>
      <Cart cart={cart} setCart={setCart} />
    </div>
  );
};

export default CartPage;