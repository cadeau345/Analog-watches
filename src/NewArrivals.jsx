import { useContext } from "react";
import { OrderContext } from "./OrderContext";
import Products from "./Products";

function NewArrivals() {
  const { products } = useContext(OrderContext);

  const newProducts = products.filter((p) => p.isNew === true);

  return <Products customProducts={newProducts} title="New Arrivals" />;
}

export default NewArrivals;