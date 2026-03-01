import { useContext } from "react";
import { OrderContext } from "./OrderContext";
import Products from "./Products";

function Men() {
  const { products } = useContext(OrderContext);

  const menProducts = products.filter(p => p.category === "men");

  return <Products customProducts={menProducts} title="Men Collection" />;
}

export default Men;