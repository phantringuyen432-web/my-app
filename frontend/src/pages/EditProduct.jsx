import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  // =========================
  // TOKEN
  // =========================
  const token = localStorage.getItem("token");

  // =========================
  // STATES
  // =========================
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: ""
  });

  const [variants, setVariants] = useState([]);

  // MULTIPLE IMAGES
  const [images, setImages] = useState([]);

  // PREVIEW
  const [previews, setPreviews] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD CATEGORIES
  // =========================
  useEffect(() => {

    fetch(
      "https://my-app-ne36.onrender.com/api/category"
    )
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {

          setCategories(data);

        }

      })
      .catch(err => {

        console.log(err);

        toast.error("Lỗi tải danh mục");

      });

  }, []);

  // =========================
  // LOAD PRODUCT DETAIL
  // =========================
  useEffect(() => {

    setLoading(true);

    fetch(
      `https://my-app-ne36.onrender.com/api/product/${id}`
    )
      .then(res => res.json())
      .then(data => {

        if (!data.product) {

          toast.error("Không tìm thấy sản phẩm");

          navigate("/admin/product-list");

          return;

        }

        const product = data.product;

        setForm({
          name: product.name || "",
          price: product.price || "",
          category_id: product.category_id || "",
          description: product.description || ""
        });

        setVariants(data.variants || []);

        // PREVIEW OLD IMAGES
        setPreviews(product.images || []);

        setLoading(false);

      })
      .catch(err => {

        console.log(err);

        toast.error("Lỗi tải sản phẩm");

        setLoading(false);

      });

  }, [id, navigate]);

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // validate
    for (let file of files) {

      if (!file.type.startsWith("image/")) {

        toast.warning(
          "Vui lòng chọn file ảnh"
        );

        return;

      }

      if (file.size > 5 * 1024 * 1024) {

        toast.warning(
          "Mỗi ảnh tối đa 5MB"
        );

        return;

      }

    }

    setImages(files);

    // preview new images
    const previewUrls = files.map(file =>
      URL.createObjectURL(file)
    );

    setPreviews(previewUrls);

  };

  // =========================
  // VARIANT CHANGE
  // =========================
  const handleVariantChange = (
    index,
    field,
    value
  ) => {

    const updated = [...variants];

    updated[index][field] = value;

    setVariants(updated);

  };

  // =========================
  // ADD VARIANT
  // =========================
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

  // =========================
  // REMOVE VARIANT
  // =========================
  const removeVariant = (index) => {

    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa biến thể?"
    );

    if (!confirmDelete) return;

    const updated = variants.filter(
      (_, i) => i !== index
    );

    setVariants(updated);

  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {

    // validate
    if (
      !form.name.trim() ||
      !form.price ||
      !form.category_id ||
      !form.description.trim()
    ) {

      toast.warning(
        "Vui lòng nhập đầy đủ thông tin"
      );

      return;

    }

    // validate price
    if (Number(form.price) <= 0) {

      toast.warning(
        "Giá sản phẩm phải lớn hơn 0"
      );

      return;

    }

    // validate variants
    for (const v of variants) {

      if (
        !v.size ||
        !v.color ||
        v.stock === ""
      ) {

        toast.warning(
          "Vui lòng nhập đầy đủ biến thể"
        );

        return;

      }

      if (Number(v.stock) < 0) {

        toast.warning(
          "Tồn kho không hợp lệ"
        );

        return;

      }

    }

    setSaving(true);

    try {

      const formData = new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "category_id",
        form.category_id
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "variants",
        JSON.stringify(variants)
      );

      // MULTIPLE IMAGES
      images.forEach((img) => {

        formData.append(
          "images",
          img
        );

      });

      const res = await fetch(
        `https://my-app-ne36.onrender.com/api/product/${id}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      );

      const data = await res.json();

      console.log(data);

      if (!res.ok) {

        toast.error(
          data.message ||
          "Cập nhật thất bại"
        );

        setSaving(false);

        return;

      }

      toast.success(
        "Cập nhật sản phẩm thành công!"
      );

      navigate(
        "/admin/product-list"
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Có lỗi xảy ra"
      );

    } finally {

      setSaving(false);

    }

  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

    );

  }

  return (

    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        ✏️ Sửa sản phẩm
      </h1>

      {/* NAME */}
      <div className="mb-5">

        <label className="block mb-2 font-semibold">
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
          className="w-full border p-3 rounded-xl"
        />

      </div>

      {/* PRICE */}
      <div className="mb-5">

        <label className="block mb-2 font-semibold">
          Giá sản phẩm
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
          className="w-full border p-3 rounded-xl"
        />

      </div>

      {/* CATEGORY */}
      <div className="mb-5">

        <label className="block mb-2 font-semibold">
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
          className="w-full border p-3 rounded-xl"
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
      <div className="mb-5">

        <label className="block mb-2 font-semibold">
          Mô tả
        </label>

        <textarea
          rows="5"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
          className="w-full border p-3 rounded-xl"
        />

      </div>

      {/* IMAGE */}
      <div className="mb-8">

        <label className="block mb-2 font-semibold">
          Hình ảnh sản phẩm
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-3 rounded-xl"
        />

        {/* PREVIEW */}
        {previews.length > 0 && (

          <div className="flex flex-wrap gap-4 mt-5">

            {previews.map((img, index) => (

              <img
                key={index}
                src={img}
                alt={`preview-${index}`}
                className="w-40 h-40 object-cover rounded-2xl border shadow"
              />

            ))}

          </div>

        )}

      </div>

      {/* VARIANTS */}
      <div className="mb-8">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-bold">
            Biến thể sản phẩm
          </h2>

          <button
            type="button"
            onClick={addVariant}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
          >
            + Thêm biến thể
          </button>

        </div>

        <div className="space-y-4">

          {variants.map((v, index) => (

            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl border"
            >

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
                className="border p-3 rounded-xl"
              />

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
                className="border p-3 rounded-xl"
              />

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
                className="border p-3 rounded-xl"
              />

              <button
                type="button"
                onClick={() =>
                  removeVariant(index)
                }
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
              >
                Xóa
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold transition disabled:opacity-50"
      >

        {saving
          ? "Đang cập nhật..."
          : "Lưu thay đổi"}

      </button>

    </div>

  );

};

export default EditProduct;