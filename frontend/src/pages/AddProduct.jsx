import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddProduct = () => {

  // =========================
  // TOKEN
  // =========================
  const token = localStorage.getItem("token");

  // =========================
  // PRODUCT FORM
  // =========================
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category_id: ""
  });

  // =========================
  // VARIANTS
  // =========================
  const [variants, setVariants] = useState([
    {
      size: "",
      color: "",
      stock: ""
    }
  ]);

  // =========================
  // IMAGES
  // =========================
  const [images, setImages] = useState([]);

  const [previews, setPreviews] = useState([]);

  // =========================
  // CATEGORIES
  // =========================
  const [categories, setCategories] =
    useState([]);

  // =========================
  // LOADING
  // =========================
  const [loading, setLoading] =
    useState(false);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {

    fetch(
      "https://my-app-ne36.onrender.com/api/category"
    )
      .then(res => res.json())

      .then(data => {

        if (Array.isArray(data)) {

          setCategories(data);

        } else {

          setCategories([]);

        }

      })

      .catch(err => {

        console.log(err);

        toast.error(
          "Lỗi tải danh mục"
        );

      });

  }, []);

  // =========================
  // CLEANUP PREVIEW MEMORY
  // =========================
  useEffect(() => {

    return () => {

      previews.forEach(url =>
        URL.revokeObjectURL(url)
      );

    };

  }, [previews]);

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImageChange = (e) => {

    const files = Array.from(
      e.target.files
    );

    if (files.length === 0) return;

    // validate
    for (let file of files) {

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        toast.warning(
          "Vui lòng chọn file ảnh"
        );

        return;

      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        toast.warning(
          "Mỗi ảnh tối đa 5MB"
        );

        return;

      }

    }

    const previewUrls = files.map(file =>
      URL.createObjectURL(file)
    );

    setImages(prev => [
      ...prev,
      ...files
    ]);

    setPreviews(prev => [
      ...prev,
      ...previewUrls
    ]);

  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const removeImage = (index) => {

    const updatedImages =
      images.filter(
        (_, i) => i !== index
      );

    const updatedPreviews =
      previews.filter(
        (_, i) => i !== index
      );

    setImages(updatedImages);

    setPreviews(updatedPreviews);

  };

  // =========================
  // HANDLE VARIANT CHANGE
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
        stock: ""
      }
    ]);

  };

  // =========================
  // REMOVE VARIANT
  // =========================
  const removeVariant = (index) => {

    const updated =
      variants.filter(
        (_, i) => i !== index
      );

    setVariants(updated);

  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {

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

    setImages([]);

    setPreviews([]);

    const fileInput =
      document.getElementById(
        "fileInput"
      );

    if (fileInput) {

      fileInput.value = "";

    }

  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {

    // validate form
    if (
      !form.name.trim() ||
      !form.price ||
      !form.category_id ||
      !form.description.trim() ||
      images.length === 0
    ) {

      toast.warning(
        "Vui lòng nhập đầy đủ thông tin!"
      );

      return;

    }

    // validate price
    if (
      Number(form.price) <= 0
    ) {

      toast.warning(
        "Giá sản phẩm phải lớn hơn 0"
      );

      return;

    }

    // validate variants
    for (let v of variants) {

      if (
        !v.size.trim() ||
        !v.color.trim() ||
        v.stock === ""
      ) {

        toast.warning(
          "Vui lòng nhập đầy đủ biến thể!"
        );

        return;

      }

      if (
        Number(v.stock) < 0
      ) {

        toast.warning(
          "Stock không hợp lệ"
        );

        return;

      }

    }

    setLoading(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "category_id",
        form.category_id
      );

      // multiple images
      images.forEach((img) => {

        formData.append(
          "images",
          img
        );

      });

      // variants
      formData.append(
        "variants",
        JSON.stringify(variants)
      );

      const res = await fetch(
        "https://my-app-ne36.onrender.com/api/product/add",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );

      const data =
        await res.json();

      // unauthorized
      if (
        res.status === 401
      ) {

        toast.error(
          "Phiên đăng nhập hết hạn"
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        window.location.href =
          "/login";

        return;

      }

      // error
      if (!res.ok) {

        toast.error(
          data.message ||
          "Thêm sản phẩm thất bại!"
        );

        return;

      }

      toast.success(
        "Thêm sản phẩm thành công!"
      );

      console.log(data);

      resetForm();

    } catch (err) {

      console.log(err);

      toast.error(
        "Lỗi server!"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

      {/* TITLE */}
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
              description:
                e.target.value
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
              category_id:
                e.target.value
            })
          }
          className="w-full border p-3 rounded-lg"
        >

          <option value="">
            -- Chọn danh mục --
          </option>

          {categories.map((c) => (

            <option
              key={c.id}
              value={c.id}
            >
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
          multiple
          accept="image/*"
          onChange={
            handleImageChange
          }
          className="w-full border p-3 rounded-lg"
        />

        {/* PREVIEW */}
        {previews.length > 0 && (

          <div className="flex flex-wrap gap-4 mt-4">

            {previews.map(
              (img, index) => (

                <div
                  key={index}
                  className="relative"
                >

                  <img
                    src={img}
                    alt={`preview-${index}`}
                    className="w-40 h-40 object-cover rounded-xl border shadow"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full"
                  >
                    ×
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* VARIANTS */}
      <div className="mb-6">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold">
            Biến thể sản phẩm
          </h2>

          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Thêm biến thể
          </button>

        </div>

        <div className="space-y-4">

          {variants.map(
            (v, index) => (

              <div
                key={index}
                className="border rounded-xl p-4 bg-gray-50"
              >

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                    className="border p-3 rounded-lg"
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
                    className="border p-3 rounded-lg"
                  />

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
                    className="border p-3 rounded-lg"
                  />

                </div>

                {variants.length > 1 && (

                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(index)
                    }
                    className="mt-3 text-red-500 hover:text-red-700"
                  >
                    Xóa biến thể
                  </button>

                )}

              </div>

            )
          )}

        </div>

      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-4 rounded-xl text-lg font-semibold transition
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >

        {loading
          ? "Đang thêm..."
          : "Thêm sản phẩm"}

      </button>

    </div>

  );

};

export default AddProduct;