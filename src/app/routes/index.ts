import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { sellerRoutes } from "./seller.routes";
import { storeRoutes } from "./store.routes";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes";
import { cartRoutes } from "./cart.routes";
import { PaymentRoutes } from "./payment.routes";
import { wishlistRoutes } from "./wishlist.routes";
import { reviewRoutes } from "./review.routes";
import { notificationRoutes } from "./notification.routes";
import { orderRoutes } from "./order.routes";
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
  {
    path: "/wishlist",
    route: wishlistRoutes,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
  {
    path: "/notification",
    route: notificationRoutes,
  },
  {
    path: "/order",
    route: orderRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
