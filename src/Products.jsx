import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { OrderContext } from "./OrderContext";

function Products({ customProducts, title }) {
  const navigate = useNavigate();
  const { products, addToCart } = useContext(OrderContext);

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState({});

  const baseProducts = customProducts ?? products ?? [];

  const displayedProducts = baseProducts.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const priceNumber = parseInt(product.price) || 0;

    const matchesPrice = maxPrice
      ? priceNumber <= parseInt(maxPrice)
      : true;

    return matchesSearch && matchesPrice;
  });

  const handleColorSelect = (productId, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  const handleAddToCart = (product) => {
    const chosenColor = selectedColors[product.id] || "Black";

    addToCart({
      ...product,
      selectedColor: chosenColor,
    });
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-10">
          {title || "Featured Collection"}
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No products found.
          </div>
        ) : (
         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-2 transition duration-300 relative"
              >
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full">
                    NEW
                  </span>
                )}

                {/* 🔥 الصورة الأساسية */}
                {/* 🔥 الصورة الأساسية */}
<div
  onClick={() => navigate(`/product/${product.id}`)}
  className="cursor-pointer overflow-hidden"
>
  <img
    src={product.mainImage || product.image}
    alt={product.name}
    className="w-full h-64 object-contain mb-6 hover:scale-110 transition duration-500"
  />
</div>

             <h3
  onClick={() => navigate(`/product/${product.id}`)}
  className="text-xl font-semibold mb-2 cursor-pointer hover:text-gray-600 transition"
>
  {product.name}
</h3>

                <p className="text-gray-500 mb-4">
                  {parseInt(product.price)} EGP
                </p>

                {/* 🎨 عرض الألوان لو موجودة في الكوليكشن */}
      {product.collections && product.collections.length > 0 && (
  <div className="flex gap-2 mb-4 flex-wrap">
    {product.collections.slice(0, 2).map((variant, i) => (
      <button
        key={i}
        onClick={() =>
          handleColorSelect(product.id, variant.color)
        }
        className={`px-3 py-1 rounded-full text-xs border transition ${
          selectedColors[product.id] === variant.color
            ? "bg-black text-white"
            : "bg-gray-100"
        }`}
      >
        {variant.color}
      </button>
    ))}

    {product.collections.length > 2 && (
      <span className="px-2 py-1 text-xs text-gray-500">
        +{product.collections.length - 2}
      </span>
    )}
  </div>
)}

                <div className="flex gap-3">
                  <button
                   onClick={(e) => {
  e.stopPropagation();
  handleAddToCart(product);
}}
                    className="w-full bg-gray-200 py-3 rounded-full hover:bg-gray-300 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full bg-black text-white py-3 rounded-full hover:scale-105 transition"
                  >
                    Buy Now
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;