import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: ""
  });

  const [variants, setVariants] = useState([]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [categories, setCategories] = useState([]);

  // load categories
  useEffect(() => {

    fetch("https://my-app-production-f477.up.railway.app/api/category")
      .then(res => res.json())
      .then(data => setCategories(data));

  }, []);

  // load product detail
  useEffect(() => {

    fetch(`https://my-app-production-f477.up.railway.app/api/product/${id}`)
      .then(res => res.json())
      .then(data => {
        const product = data.product;
        setForm({
          name: product.name || "",
          price: product.price || "",
          category_id: product.category_id || "",
          description: product.description || ""
        });
        setVariants(data.variants || []);
        setPreview(product.image);
      });
  }, [id]);

  // chọn ảnh
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // update variant
  const handleVariantChange = (index, field, value) => {

    const updated = [...variants];

    updated[index][field] = value;

    setVariants(updated);
  };

  // thêm variant
  const addVariant = () => {

    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        stock: 0
      }
    ]);
  };

  // xóa variant
  const removeVariant = (index) => {

    const updated = [...variants];

    updated.splice(index, 1);

    setVariants(updated);
  };

  // submit
  const handleSubmit = () => {

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category_id", form.category_id);
    formData.append("description", form.description);

    formData.append(
      "variants",
      JSON.stringify(variants)
    );

    if (image) {
      formData.append("image", image);
    }

    fetch(`https://my-app-production-f477.up.railway.app/api/product/${id}`, {
      method: "PUT",
      body: formData
    })
      .then(res => res.json())
      .then(() => {

        alert("Cập nhật thành công");

        navigate("/admin/product-list");

      })
      .catch(err => {

        console.log(err);

        alert("Có lỗi xảy ra");

      });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">

      <h1 className="text-3xl font-bold mb-6">
        Sửa sản phẩm
      </h1>

      {/* NAME */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
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
        />
      </div>

      {/* PRICE */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
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
        />
      </div>

      {/* CATEGORY */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
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

          {categories.map(c => (
            <option
              key={c.id}
              value={c.id}
            >
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
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
        />
      </div>

      {/* IMAGE */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Ảnh sản phẩm
        </label>

        <input
          type="file"
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 object-cover rounded-xl mt-4 border"
          />
        )}
      </div>

      {/* VARIANTS */}
      <div className="mb-6">

        <div className="flex justify-between items-center mb-3">

          <h2 className="text-xl font-bold">
            Biến thể sản phẩm
          </h2>

          <button
            onClick={addVariant}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Thêm biến thể
          </button>

        </div>

        {variants.map((v, index) => (

          <div
            key={index}
            className="grid grid-cols-4 gap-3 mb-3"
          >

            {/* size */}
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
              className="border p-2 rounded"
            />

            {/* color */}
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
              className="border p-2 rounded"
            />

            {/* stock */}
            <input
              type="number"
              placeholder="Tồn kho"
              value={v.stock}
              onChange={(e) =>
                handleVariantChange(
                  index,
                  "stock",
                  e.target.value
                )
              }
              className="border p-2 rounded"
            />

            {/* remove */}
            <button
              onClick={() => removeVariant(index)}
              className="bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Xóa
            </button>

          </div>

        ))}

      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold"
      >
        Lưu thay đổi
      </button>

    </div>
  );
};

export default EditProduct;