import { createContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { increment } from "firebase/firestore";

export const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);

  /* 🔄 Load Products */
  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(list);
  };

  /* ⭐ Add Rating */
  const addRating = async (productId, rating) => {
    const productRef = doc(db, "products", productId);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newTotal = (product.ratingTotal || 0) + rating;
    const newCount = (product.ratingCount || 0) + 1;

    await updateDoc(productRef, {
      ratingTotal: newTotal,
      ratingCount: newCount,
    });

    fetchProducts();
  };

  /* 🔄 Load Orders */
  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(list);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  /* 🛍 Add Product */
  const addProduct = async (product) => {
    await addDoc(collection(db, "products"), product);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  /* 🛒 CART SYSTEM */

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === product.selectedColor
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id, color) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedColor === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id, color) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.selectedColor === color
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id, color) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.selectedColor === color)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  /* 📦 Add Order */
  const addOrder = async (order) => {
   await addDoc(collection(db, "orders"), {
  ...order,
  status: "Pending",
  createdAt: new Date(),
});

/* 🔥 زيادة عدد المبيعات للمنتج */
const productRef = doc(db, "products", order.product.id);

await updateDoc(productRef, {
  salesCount: increment(order.product.quantity || 1),
});
    fetchOrders();
  };

  /* 🎟 Create Coupon */
  const createCoupon = async (couponData) => {
    const couponRef = doc(db, "coupons", couponData.code);

    await setDoc(couponRef, {
      code: couponData.code,
      discount: Number(couponData.discount),
      maxUses: Number(couponData.maxUses),
      usedCount: 0,
      usedPhones: [],
      expiresAt: new Date(couponData.expiresAt),
    });
  };

  /* 🎟 Get Coupon */
  const getCoupon = async (code) => {
    const couponRef = doc(db, "coupons", code.toUpperCase());
    const snapshot = await getDoc(couponRef);

    if (!snapshot.exists()) return null;

    return snapshot.data();
  };

  /* 🎟 Validate Coupon */
  const validateCoupon = async (code, phone) => {
    const coupon = await getCoupon(code);
    if (!coupon) return { valid: false, message: "Invalid coupon" };

    if (coupon.usedCount >= coupon.maxUses)
      return { valid: false, message: "Coupon expired (max uses reached)" };

    if (coupon.usedPhones.includes(phone))
      return { valid: false, message: "You already used this coupon" };

    if (new Date() > coupon.expiresAt.toDate())
      return { valid: false, message: "Coupon expired" };

    return { valid: true, discount: coupon.discount };
  };

  /* 🎟 Apply Coupon Usage */
  const applyCouponUsage = async (code, phone) => {
    const couponRef = doc(db, "coupons", code.toUpperCase());
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) return;

    const coupon = couponSnap.data();

    await updateDoc(couponRef, {
      usedCount: coupon.usedCount + 1,
      usedPhones: [...coupon.usedPhones, phone],
    });
  };

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "orders", id), {
      status: newStatus,
    });
    fetchOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        orders,
        addOrder,
        updateStatus,
        addRating,
        createCoupon,
        validateCoupon,
        applyCouponUsage,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}