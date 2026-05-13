import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = ({ addToCart }) => {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [selectedVariant, setSelectedVariant] = useState(null);

  // load product detail
  useEffect(() => {

    fetch(`http://my-app-production-f477.up.railway.app/api/product/${id}`)
      .then(res => res.json())
      .then(data => {

        setProduct(data.product);
        setVariants(data.variants);

      });

  }, [id]);

  // tìm variant theo size + màu
  useEffect(() => {

    if (!selectedColor || !selectedSize) {
      setSelectedVariant(null);
      return;
    }

    const found = variants.find(
      v =>
        v.color === selectedColor &&
        v.size === selectedSize
    );

    setSelectedVariant(found || null);

  }, [selectedColor, selectedSize, variants]);

  // loading
  if (!product) {
    return <p className="p-10">Loading...</p>;
  }

  // unique colors
  const colors = [
    ...new Set(variants.map(v => v.color))
  ];

  // unique sizes theo màu
  const sizes = [
    ...new Set(
      variants
        .filter(v => v.color === selectedColor)
        .map(v => v.size)
    )
  ];

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div>

          <img
            src={`http://my-app-production-f477.up.railway.app/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-2xl"
          />

        </div>

        {/* INFO */}
        <div>

          {/* NAME */}
          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {/* PRICE */}
          <p className="text-3xl text-red-500 font-bold mb-6">
            {Number(product.price).toLocaleString()} VND
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

                    // reset size khi đổi màu
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
                    onClick={() => setSelectedSize(size)}
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

              addToCart({

                product_id: product.id,

                variant_id: selectedVariant.id,

                name: product.name,

                image: product.image,

                price: product.price,

                size: selectedVariant.size,

                color: selectedVariant.color,

                stock: selectedVariant.stock,

                quantity: 1

              });

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