import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { sellerRoutes } from "./seller.routes";
import { storeRoutes } from "./store.routes";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes";
import { cartRoutes } from "./cart.routes";
import { PaymentRoutes } from "./payment.routes";
export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/seller",
    route: sellerRoutes,
  },
  {
    path: "/store",
    route: storeRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/product",
    route: productRoutes,
  },
  {
    path: "/cart",
    route: cartRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
