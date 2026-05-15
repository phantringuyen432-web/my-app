import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = () => {
    fetch("https://my-app-ne36.onrender.com/api/product")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;

    fetch(`https://my-app-ne36.onrender.com/api/product/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        alert("Đã xóa");
        fetchProducts();
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Danh sách sản phẩm
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {products.map(p => (
          <div
            key={p.id}
            className="flex justify-between items-center border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.image}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{p.name}</p>
                <p>{Number(p.price).toLocaleString()} VND</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Sửa
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;