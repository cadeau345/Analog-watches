import { useContext, useEffect, useState } from "react";
import { OrderContext } from "./OrderContext";
import { Navigate, useNavigate } from "react-router-dom";
import ProductManager from "./ProductManager";
import { requestNotificationPermission } from "./firebase-messaging";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Admin() {

const navigate = useNavigate();
const { currentUser } = useContext(OrderContext);
const { orders, updateStatus } = useContext(OrderContext);

const ADMIN_EMAIL = "moazmahmoud@gmail.com";

const [liveOrders, setLiveOrders] = useState([]);
const [newOrderIds, setNewOrderIds] = useState([]);

useEffect(() => {
requestNotificationPermission();
}, []);

useEffect(() => {

const unsubscribe = onSnapshot(
collection(db,"orders"),
(snapshot)=>{

const changes = snapshot.docChanges();

changes.forEach(change=>{

if(change.type === "added"){

const order = {
id: change.doc.id,
...change.doc.data()
};

setLiveOrders(prev => [order,...prev]);

setNewOrderIds(prev => [...prev, order.id]);

// صوت
const audio = new Audio("/notification.mp3");
audio.volume = 1;
audio.play().catch(()=>{});

// Popup
const popup = document.createElement("div");

popup.innerText = "🛒 New Order Received";

popup.style.position = "fixed";
popup.style.top = "20px";
popup.style.right = "20px";
popup.style.background = "black";
popup.style.color = "white";
popup.style.padding = "15px 25px";
popup.style.borderRadius = "10px";
popup.style.zIndex = "9999";

document.body.appendChild(popup);

setTimeout(()=>{
popup.remove();
},4000);

}

});

});
return ()=>unsubscribe();

},[]);

if (!currentUser) {
return <Navigate to="/admin-login" />;
}

if (currentUser.email !== ADMIN_EMAIL) {
return <Navigate to="/" />;
}

if (localStorage.getItem("isAdmin") !== "true") {
return <Navigate to="/admin-login" />;
}

const allOrders = [...liveOrders,...orders];

const totalRevenue = allOrders
.filter(o=>o.status==="Delivered")
.reduce((acc,curr)=> acc + (parseInt(curr.product?.price)||0),0);

const pendingCount = allOrders.filter(o=>o.status==="Pending").length;
const deliveredCount = allOrders.filter(o=>o.status==="Delivered").length;
const cancelledCount = allOrders.filter(o=>o.status==="Cancelled").length;

const chartData = [
{ name:"Pending", value:pendingCount },
{ name:"Delivered", value:deliveredCount },
{ name:"Cancelled", value:cancelledCount }
];

const handleLogout = ()=>{
localStorage.removeItem("isAdmin");
navigate("/");
};

return (

<div className="min-h-screen bg-gray-50 pt-28 px-6">

<div className="max-w-7xl mx-auto flex justify-between items-center mb-10">

<h1 className="text-4xl font-bold flex items-center gap-3">

Admin Dashboard

<span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
{pendingCount}
</span>

</h1>

<button
onClick={handleLogout}
className="bg-black text-white px-6 py-2 rounded-full hover:scale-105 transition"
>
Logout
</button>

</div>

<div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 mb-16">

<div className="bg-white shadow-lg p-6 rounded-2xl">
<h3>Total Orders</h3>
<p className="text-3xl font-bold">{allOrders.length}</p>
</div>

<div className="bg-white shadow-lg p-6 rounded-2xl">
<h3>Pending</h3>
<p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
</div>

<div className="bg-white shadow-lg p-6 rounded-2xl">
<h3>Delivered</h3>
<p className="text-3xl font-bold text-green-600">{deliveredCount}</p>
</div>

<div className="bg-white shadow-lg p-6 rounded-2xl">
<h3>Revenue</h3>
<p className="text-3xl font-bold">{totalRevenue} EGP</p>
</div>

</div>

<div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-16">

<h2 className="text-2xl font-bold mb-6">
Sales Overview
</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={chartData}>
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Bar dataKey="value" fill="#000000" />
</BarChart>

</ResponsiveContainer>

</div>

<div className="max-w-7xl mx-auto mb-16">

<h2 className="text-3xl font-bold mb-6">
Manage Products
</h2>

<ProductManager/>

</div>

<div className="max-w-7xl mx-auto space-y-6">

{allOrders.map(order => (

<div
key={order.id}
className={`bg-white shadow-md p-6 rounded-2xl border
${newOrderIds.includes(order.id) ? "border-green-500 bg-green-50" : ""}
`}
>

<div className="flex justify-between flex-wrap gap-6">

<div className="flex items-center gap-6">

<img
src={
order.product?.collections
?.find(c => c.color === order.product?.selectedColor)
?.images?.[0] || order.product?.mainImage
}
className="w-20 h-20 object-cover rounded-lg"
/>

<div>

<h3 className="font-bold text-lg">
{order.product?.name}
</h3>

<p><strong>Name:</strong> {order.fullName}</p>

<p><strong>Phone:</strong> {order.phone}</p>

<p><strong>Color:</strong> {order.product?.selectedColor}</p>

<p><strong>Address:</strong> {order.address}</p>

<p><strong>Governorate:</strong> {order.governorate}</p>

<p><strong>Price:</strong> {order.product?.price} EGP</p>

</div>

</div>

<div className="flex gap-3">

{order.status !== "Delivered" && (

<button
onClick={()=>updateStatus(order.id,"Delivered")}
className="bg-green-500 text-white px-4 py-2 rounded-full"
>

Mark Delivered

</button>

)}

{order.status !== "Cancelled" && (

<button
onClick={()=>updateStatus(order.id,"Cancelled")}
className="bg-red-500 text-white px-4 py-2 rounded-full"
>

Cancel

</button>

)}

</div>

</div>

</div>

))}

</div>

</div>

);

}

export default Admin;