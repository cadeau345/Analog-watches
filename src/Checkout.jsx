import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "./OrderContext";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";

function Checkout() {
  const navigate = useNavigate();
  const { addOrder, clearCart, cart } = useContext(OrderContext);

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  const egyptGovernorates = [
    "القاهرة","الجيزة","الإسكندرية","الدقهلية","البحر الأحمر","البحيرة",
    "الفيوم","الغربية","الإسماعيلية","المنوفية","المنيا","القليوبية",
    "الوادي الجديد","السويس","أسوان","أسيوط","بني سويف","بورسعيد",
    "دمياط","الشرقية","جنوب سيناء","كفر الشيخ","مطروح",
    "الأقصر","قنا","شمال سيناء","سوهاج"
  ];

  const [formData, setFormData] = useState({

  fullName,
  phone,
  address,
  governorate,

  product,
  selectedColor: product.selectedColor,

});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* 💰 حساب الأسعار */
  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * (item.quantity || 1),
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  /* 🎟 Apply Coupon */
  const handleApplyCoupon = async () => {
    setCouponError("");

    if (!couponCode) return;

    const couponRef = doc(db, "coupons", couponCode);
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      setCouponError("الكوبون غير صحيح");
      return;
    }

    const couponData = couponSnap.data();

    if (couponData.expiresAt?.toDate() < new Date()) {
      setCouponError("الكوبون منتهي");
      return;
    }

    if (couponData.usedCount >= couponData.maxUses) {
      setCouponError("تم استخدام الكوبون بالكامل");
      return;
    }

    if (couponData.usedPhones?.includes(formData.phone)) {
      setCouponError("لقد استخدمت هذا الكوبون من قبل");
      return;
    }

    setDiscountPercent(couponData.discount);
  };

  /* 🧾 Submit Order */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    for (let item of cart) {
      await addOrder({
        fullName: formData.fullName,
        phone: formData.phone,
        altPhone: formData.altPhone,
        governorate: formData.governorate,
        address: formData.address,
        product: item,

        couponCode: discountPercent > 0 ? couponCode : null,
        discountPercent,
        discountAmount,
        finalTotal,
      });
    }

    /* تحديث الكوبون لو اتستخدم */
    if (discountPercent > 0) {
      const couponRef = doc(db, "coupons", couponCode);
      await updateDoc(couponRef, {
        usedCount: increment(1),
        usedPhones: arrayUnion(formData.phone),
      });
    }

    clearCart();
    navigate("/success");
  };

  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Checkout
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">
          Your cart is empty.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-3xl p-10 flex flex-col gap-6"
        >
          <input
            type="text"
            name="fullName"
            placeholder="الاسم بالكامل"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg"
          />

          <input
            type="tel"
            name="phone"
            placeholder="رقم الموبايل"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg"
          />

          <input
            type="tel"
            name="altPhone"
            placeholder="رقم بديل (اختياري)"
            value={formData.altPhone}
            onChange={handleChange}
            className="border p-4 rounded-lg"
          />

          <select
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            required
            className="border p-4 rounded-lg bg-white"
          >
            <option value="">اختر المحافظة</option>
            {egyptGovernorates.map((gov, index) => (
              <option key={index} value={gov}>
                {gov}
              </option>
            ))}
          </select>

          <textarea
            name="address"
            placeholder="العنوان بالتفصيل"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="border p-4 rounded-lg"
          />

          {/* 🎟 Coupon Section */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="كود الخصم"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(e.target.value.toUpperCase())
              }
              className="border p-3 rounded-lg w-full"
            />

            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-gray-200 px-4 rounded-lg"
            >
              تطبيق
            </button>
          </div>

          {couponError && (
            <p className="text-red-500 text-sm">
              {couponError}
            </p>
          )}

          <div className="space-y-1 text-sm">
            <p>الإجمالي: {subtotal} EGP</p>

            {discountPercent > 0 && (
              <p className="text-green-600">
                خصم: -{discountAmount} EGP ({discountPercent}%)
              </p>
            )}

            <p className="font-bold text-lg">
              النهائي: {finalTotal} EGP
            </p>
          </div>

          <button
            type="submit"
            className="bg-black text-white py-4 rounded-full hover:scale-105 transition"
          >
            تأكيد الطلب
          </button>
        </form>
      )}
    </div>
  );
}

export default Checkout;