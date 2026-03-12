import { useState, useContext, useEffect } from "react";
import { OrderContext } from "./OrderContext";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function ProductManager() {
  const { products, addProduct, deleteProduct } =
    useContext(OrderContext);

  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("men");
  const [isNew, setIsNew] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  const [collections, setCollections] = useState([]);
  const [colorName, setColorName] = useState("");
  const [colorImages, setColorImages] = useState([]);

  /* ================== IMAGE COMPRESSION ================== */

  const compressImage = (file) => {
    return new Promise((resolve) => {

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {

        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 600;
          const scale = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressed = canvas.toDataURL("image/jpeg", 0.6);

          resolve(compressed);

        };

      };

    });
  };

  /* ================== MAIN IMAGE ================== */

  const handleMainImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1_000_000) {
      alert("Image too large (Max 1MB)");
      return;
    }

    const compressed = await compressImage(file);
    setMainImage(compressed);
  };

  /* ================== COLOR IMAGES ================== */

  const handleColorImages = (e) => {
    const files = Array.from(e.target.files);

    const readers = files.map((file) => {
      return new Promise(async (resolve) => {

        if (file.size > 1_000_000) {
          alert("One of the images is too large (Max 1MB)");
          resolve(null);
          return;
        }

        const compressed = await compressImage(file);
        resolve(compressed);

      });
    });

    Promise.all(readers).then((imgs) => {
      const validImgs = imgs.filter(Boolean);
      setColorImages(validImgs);
    });
  };

  /* ================== ADD COLOR ================== */

  const addColorCollection = () => {
    if (!colorName || colorImages.length === 0) {
      alert("Enter color name & images");
      return;
    }

    setCollections((prev) => [
      ...prev,
      {
        color: colorName,
        images: colorImages,
      },
    ]);

    setColorName("");
    setColorImages([]);
  };

  /* ================== ADD PRODUCT ================== */

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !mainImage) {
      alert("Fill main product info first");
      return;
    }

    await addProduct({
      name,
      price: parseInt(price),
      category,
      isNew,
      mainImage,
      collections,
      salesCount: 0,
      ratingTotal: 0,
      ratingCount: 0,
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);

    setName("");
    setPrice("");
    setCategory("men");
    setIsNew(false);
    setMainImage(null);
    setCollections([]);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg">

      {showNotification && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl z-50">
          ✅ Product Added Successfully
        </div>
      )}

      <form onSubmit={handleAddProduct} className="space-y-6">

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg w-full"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 rounded-lg w-full"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-lg w-full"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          Mark as NEW
        </label>

        {/* MAIN IMAGE */}
        <div>
          <p className="font-semibold mb-2">
            Main Product Image (Home)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImage}
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* COLOR COLLECTION */}
        <div className="border p-6 rounded-xl">
          <h3 className="font-semibold mb-4">
            Add Color Collection
          </h3>

          <input
            type="text"
            placeholder="Color Name (Black / Silver...)"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="border p-3 rounded-lg w-full mb-3"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleColorImages}
            className="border p-3 rounded-lg w-full mb-3"
          />

          <button
            type="button"
            onClick={addColorCollection}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            Add This Color
          </button>

          {/* SHOW ADDED COLORS */}
          <div className="mt-4 space-y-2">
            {collections.map((c, i) => (
              <div
                key={i}
                className="text-sm bg-gray-100 p-2 rounded"
              >
                {c.color} ({c.images.length} images)
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-4 w-full rounded-full hover:scale-105 transition"
        >
          Add Product
        </button>

      </form>

      {/* PRODUCTS LIST */}
      <div className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">
          Products ({products.length})
        </h2>

        {products.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded-2xl flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  p.mainImage ??
                  p.collections?.[0]?.images?.[0] ??
                  "/no-image.png"
                }
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {p.price} EGP
                </p>
              </div>
            </div>

            <button
              onClick={() => deleteProduct(p.id)}
              className="bg-red-500 text-white px-4 py-1 rounded-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ProductManager;