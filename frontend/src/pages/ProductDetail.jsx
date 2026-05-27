import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetail = ({ addToCart }) => {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [variants, setVariants] = useState([]);

  // MULTIPLE IMAGES
  const [selectedImage, setSelectedImage] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  // FAVORITE
  const [isFavorite, setIsFavorite] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token =
    localStorage.getItem("token");

  // =========================
  // FETCH PRODUCT DETAIL
  // =========================
  useEffect(() => {

    fetch(
      `https://my-app-ne36.onrender.com/api/product/${id}`
    )
      .then(res => res.json())

      .then(data => {

        console.log(data);

        setProduct(data.product);

        setVariants(data.variants || []);

        // image đầu tiên
        if (
          data.product?.images &&
          data.product.images.length > 0
        ) {

          setSelectedImage(
            data.product.images[0]
          );

        }

      })

      .catch(err => {

        console.log(err);

        toast.error(
          "Lỗi tải sản phẩm"
        );

      });

  }, [id]);

  // =========================
  // CHECK FAVORITE
  // =========================
  useEffect(() => {

    if (!user || !token) return;

    fetch(
      "https://my-app-ne36.onrender.com/api/favorite",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => res.json())

      .then(data => {

        const found = data.find(
          item =>
            item.product_id === Number(id)
        );

        setIsFavorite(!!found);

      })

      .catch(err => {

        console.log(err);

      });

  }, [id, token, user]);

  // =========================
  // TOGGLE FAVORITE
  // =========================
  const toggleFavorite = async () => {

    if (!user) {

      toast.warning(
        "Vui lòng đăng nhập"
      );

      return;

    }

    try {

      const res = await fetch(
        "https://my-app-ne36.onrender.com/api/favorite",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            product_id: product.id
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        toast.error(
          data.message ||
          "Lỗi yêu thích"
        );

        return;

      }

      setIsFavorite(
        data.favorite
      );

      toast.success(
        data.favorite
          ? "Đã thêm vào yêu thích ❤️"
          : "Đã bỏ yêu thích"
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Lỗi server"
      );

    }

  };

  // =========================
  // FIND VARIANT
  // =========================
  useEffect(() => {

    if (
      !selectedColor ||
      !selectedSize
    ) {

      setSelectedVariant(null);

      return;

    }

    const found = variants.find(
      v =>
        v.color === selectedColor &&
        v.size === selectedSize
    );

    setSelectedVariant(found || null);

  }, [
    selectedColor,
    selectedSize,
    variants
  ]);

  // =========================
  // LOADING
  // =========================
  if (!product) {

    return (

      <div className="min-h-screen bg-gray-100 py-10 px-4">

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 grid md:grid-cols-2 gap-10 animate-pulse">

          <div className="w-full h-[500px] bg-gray-300 rounded-2xl"></div>

          <div>

            <div className="h-10 bg-gray-300 rounded mb-6"></div>

            <div className="h-8 w-1/2 bg-gray-300 rounded mb-8"></div>

            <div className="h-28 bg-gray-300 rounded mb-8"></div>

            <div className="h-14 bg-gray-300 rounded-xl mb-6"></div>

            <div className="h-14 bg-gray-300 rounded-xl mb-6"></div>

            <div className="h-16 bg-gray-300 rounded-2xl"></div>

          </div>

        </div>

      </div>

    );

  }

  // =========================
  // UNIQUE COLORS
  // =========================
  const colors = [
    ...new Set(
      variants.map(v => v.color)
    )
  ];

  // =========================
  // UNIQUE SIZES
  // =========================
  const sizes = [
    ...new Set(
      variants
        .filter(
          v =>
            v.color === selectedColor
        )
        .map(v => v.size)
    )
  ];

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div>

          {/* MAIN IMAGE */}
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-2xl border"
          />

          {/* THUMBNAILS */}
          {product.images?.length > 0 && (

            <div className="flex gap-4 mt-4 flex-wrap">

              {product.images.map(
                (img, index) => (

                  <img
                    key={index}
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() =>
                      setSelectedImage(img)
                    }
                    className={`
                      w-24 h-24 object-cover rounded-xl border-2 cursor-pointer transition
                      ${
                        selectedImage === img
                          ? "border-black scale-105"
                          : "border-gray-300 hover:border-gray-500"
                      }
                    `}
                  />

                )
              )}

            </div>

          )}

        </div>

        {/* INFO */}
        <div>

          {/* NAME + FAVORITE */}
          <div className="flex items-start justify-between gap-4 mb-4">

            <h1 className="text-4xl font-bold">
              {product.name}
            </h1>

            <button
              onClick={toggleFavorite}
              className={`
                text-4xl transition
                ${
                  isFavorite
                    ? "text-red-500"
                    : "text-gray-300 hover:text-red-400"
                }
              `}
            >
              ♥
            </button>

          </div>

          {/* PRICE */}
          <p className="text-3xl text-red-500 font-bold mb-6">
            {Number(
              product.price
            ).toLocaleString()}{" "}
            VND
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-8 leading-7">
            {product.description}
          </p>

          {/* COLOR */}
          <div className="mb-6">

            <h3 className="font-semibold mb-3">
              Màu sắc
            </h3>

            <div className="flex flex-wrap gap-3">

              {colors.map(color => (

                <button
                  key={color}
                  onClick={() => {

                    setSelectedColor(color);

                    setSelectedSize("");

                    setSelectedVariant(null);

                  }}
                  className={`
                    px-5 py-2 rounded-xl border transition
                    ${
                      selectedColor === color
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                    }
                  `}
                >
                  {color}
                </button>

              ))}

            </div>

          </div>

          {/* SIZE */}
          {selectedColor && (

            <div className="mb-6">

              <h3 className="font-semibold mb-3">
                Size
              </h3>

              <div className="flex flex-wrap gap-3">

                {sizes.map(size => (

                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`
                      w-14 h-14 rounded-xl border font-semibold transition
                      ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-white hover:bg-gray-100"
                      }
                    `}
                  >
                    {size}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* STOCK */}
          {selectedVariant && (

            <div className="mb-6">

              {selectedVariant.stock > 0 ? (

                <p className="text-green-600 font-semibold text-lg">
                  Còn {selectedVariant.stock} sản phẩm
                </p>

              ) : (

                <p className="text-red-500 font-semibold text-lg">
                  Hết hàng
                </p>

              )}

            </div>

          )}

          {/* BUTTON */}
          <button
            disabled={
              !selectedVariant ||
              selectedVariant.stock <= 0
            }
            onClick={() => {

              // chưa login
              if (!user) {

                toast.warning(
                  "Vui lòng đăng nhập!"
                );

                return;

              }

              // chưa chọn biến thể
              if (!selectedVariant) {

                toast.warning(
                  "Vui lòng chọn size và màu"
                );

                return;

              }

              // hết hàng
              if (
                selectedVariant.stock <= 0
              ) {

                toast.error(
                  "Sản phẩm đã hết hàng"
                );

                return;

              }

              // add cart
              addToCart({

                product_id: product.id,

                variant_id:
                  selectedVariant.id,

                name: product.name,

                image:
                  selectedImage ||

                  product.images?.[0],

                price: product.price,

                size:
                  selectedVariant.size,

                color:
                  selectedVariant.color,

                stock:
                  selectedVariant.stock,

                quantity: 1

              });

              toast.success(
                "Đã thêm vào giỏ hàng"
              );

            }}
            className={`
              w-full py-4 rounded-2xl text-lg font-semibold transition
              ${
                selectedVariant &&
                selectedVariant.stock > 0
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >

            {
              selectedVariant?.stock > 0
                ? "Thêm vào giỏ hàng"
                : "Hết hàng"
            }

          </button>

        </div>

      </div>

    </div>

  );

};

export default ProductDetail;