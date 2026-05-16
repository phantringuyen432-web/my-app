import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddProduct = () => {

  // product info
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category_id: ""
  });

  // variants
  const [variants, setVariants] = useState([
    {
      size: "",
      color: "",
      stock: ""
    }
  ]);

  // image
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // categories
  const [categories, setCategories] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  // load category
  useEffect(() => {
    fetch("https://my-app-ne36.onrender.com/api/category")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // upload image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // change variant
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];

    updated[index][field] = value;

    setVariants(updated);
  };

  // add variant
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        stock: ""
      }
    ]);
  };

  // remove variant
  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  // submit
  const handleSubmit = async () => {

    if (
      !form.name ||
      !form.price ||
      !form.category_id ||
      !form.description ||
      !image
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category_id", form.category_id);
      formData.append("image", image);

      // gửi variants dạng JSON
      formData.append(
        "variants",
        JSON.stringify(variants)
      );

      const res = await fetch(
        "https://my-app-ne36.onrender.com/api/product/add",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      console.log(data);

      toast.success("Thêm sản phẩm thành công!");

      // reset
      setForm({
        name: "",
        price: "",
        description: "",
        category_id: ""
      });

      setVariants([
        {
          size: "",
          color: "",
          stock: ""
        }
      ]);

      setImage(null);
      setPreview(null);

      document.getElementById("fileInput").value = "";

    } catch (err) {

      console.log(err);
      toast.error("Lỗi thêm sản phẩm!");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

      <h1 className="text-3xl font-bold mb-6">
        Thêm sản phẩm
      </h1>

      {/* NAME */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Tên sản phẩm
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          className="w-full border p-3 rounded-lg"
          placeholder="VD: Hoodie Nike"
        />
      </div>

      {/* PRICE */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Giá
        </label>

        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value
            })
          }
          className="w-full border p-3 rounded-lg"
          placeholder="650000"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Mô tả
        </label>

        <textarea
          rows="4"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
          className="w-full border p-3 rounded-lg"
          placeholder="Mô tả sản phẩm..."
        />
      </div>

      {/* CATEGORY */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Danh mục
        </label>

        <select
          value={form.category_id}
          onChange={(e) =>
            setForm({
              ...form,
              category_id: e.target.value
            })
          }
          className="w-full border p-3 rounded-lg"
        >
          <option value="">
            -- Chọn danh mục --
          </option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* IMAGE */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Hình ảnh
        </label>

        <input
          id="fileInput"
          type="file"
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 w-48 h-48 object-cover rounded-xl border"
          />
        )}
      </div>

      {/* VARIANTS */}
      <div className="mb-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Biến thể sản phẩm
          </h2>

          <button
            onClick={addVariant}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Thêm biến thể
          </button>
        </div>

        <div className="space-y-4">

          {variants.map((v, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 bg-gray-50"
            >

              <div className="grid grid-cols-3 gap-4">

                {/* SIZE */}
                <input
                  type="text"
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "size",
                      e.target.value
                    )
                  }
                  className="border p-2 rounded-lg"
                />

                {/* COLOR */}
                <input
                  type="text"
                  placeholder="Màu"
                  value={v.color}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "color",
                      e.target.value
                    )
                  }
                  className="border p-2 rounded-lg"
                />

                {/* STOCK */}
                <input
                  type="number"
                  placeholder="Số lượng"
                  value={v.stock}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "stock",
                      e.target.value
                    )
                  }
                  className="border p-2 rounded-lg"
                />

              </div>

              {/* REMOVE */}
              {variants.length > 1 && (
                <button
                  onClick={() => removeVariant(index)}
                  className="mt-3 text-red-500 hover:text-red-700"
                >
                  Xóa biến thể
                </button>
              )}

            </div>
          ))}

        </div>
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-semibold transition"
      >
        {loading
          ? "Đang thêm..."
          : "Thêm sản phẩm"}
      </button>

    </div>
  );
};

export default AddProduct;