import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useMemo } from "react";
import { OrderContext } from "./OrderContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addRating } = useContext(OrderContext);

  const product = products.find(
    (p) => String(p.id) === String(id)
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  /* ⭐ Average Rating */
 const averageRating = useMemo(() => {
  if (!product || !product.ratingCount) return 0;

  return (product.ratingTotal / product.ratingCount).toFixed(1);
}, [product]);
  /* 🔥 Similar Products */
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.category === product.category &&
          p.id !== product.id
      )
      .slice(0, 3);
  }, [products, product]);

  /* 🔥 Most Selling Products */
  const mostSellingProducts = useMemo(() => {
    if (!products) return [];

    return [...products]
      .filter((p) => p.id !== product?.id)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 3);
  }, [products, product]);

  useEffect(() => {
    if (!product) return;

    if (product.mainImage) {
      setSelectedImage(product.mainImage);
    } else if (Array.isArray(product.images) && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else if (product.image) {
      setSelectedImage(product.image);
    }

    if (product.collections && product.collections.length > 0) {
      setSelectedColor(product.collections[0].color);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="pt-40 text-center text-xl">
        Product not found
      </div>
    );
  }

  const handleCheckout = () => {
    addToCart({
      ...product,
      selectedColor,
    });
    navigate("/checkout");
  };

  return (
    <div className="pt-32 max-w-6xl mx-auto px-6">

      <div className="grid md:grid-cols-2 gap-12">

        {/* Image Section */}
        <div>
          {selectedImage && (
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-96 object-contain rounded-2xl mb-6"
            />
          )}

          <div className="flex gap-3 flex-wrap">
            {Array.isArray(product.images) &&
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="thumb"
                  onClick={() => setSelectedImage(img)}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer border hover:scale-105 transition"
                />
              ))}

            {!product.images && product.image && (
              <img
                src={product.image}
                alt="thumb"
                onClick={() => setSelectedImage(product.image)}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
              />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-2xl mb-6">
            {product.price} EGP
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map((star) => (
            <button
  key={star}
  onClick={() => addRating(product.id, star)}
  className={`text-2xl transition ${
    star <= Math.round(averageRating)
      ? "text-yellow-400"
      : "text-gray-300"
  } hover:scale-125`}
>
  ★
</button>
            ))}
            <span className="text-gray-500 text-sm">
              ({averageRating})
            </span>
          </div>

          <div className="flex gap-2 mt-4 mb-6">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => addRating(product.id, star)}
                className="text-xl hover:scale-125 transition"
              >
                ⭐
              </button>
            ))}
          </div>

          {/* Colors */}
          {product.collections && product.collections.length > 0 && (
            <div className="flex gap-3 mb-6 flex-wrap">
              {product.collections.map((variant, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedColor(variant.color);
                    if (variant.images?.length > 0) {
                      setSelectedImage(variant.images[0]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full border ${
                    selectedColor === variant.color
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {variant.color}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleCheckout}
            className="bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Most Selling */}
      {mostSellingProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">
            الأكثر مبيعًا 🔥
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {mostSellingProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="cursor-pointer bg-white shadow-md p-4 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition"
              >
                <img
                  src={
                    item.mainImage ||
                    item.image ||
                    item.images?.[0]
                  }
                  alt={item.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>
                <p className="text-gray-500">
                  {item.price} EGP
                </p>
              
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">
            منتجات مشابهة
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {similarProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="cursor-pointer bg-white shadow-md p-4 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition"
              >
                <img
                  src={
                    item.mainImage ||
                    item.image ||
                    item.images?.[0]
                  }
                  alt={item.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>
                <p className="text-gray-500">
                  {item.price} EGP
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;