import { useContext } from "react";
import { OrderContext } from "./OrderContext";
import Products from "./Products";

function Women() {
  const { products } = useContext(OrderContext);

  const womenProducts = products.filter(
    (p) =>
      p.category &&
      p.category.toLowerCase().trim() === "women"
  );

  return (
    <Products
      customProducts={womenProducts}
      title="Women Collection"
    />
  );
}

export default Women;