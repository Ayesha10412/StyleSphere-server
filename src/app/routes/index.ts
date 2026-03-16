import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { sellerRoutes } from "./seller.routes";
import { storeRoutes } from "./store.routes";
import { categoryRoutes } from "./category.routes";
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
    path: "category",
    route: categoryRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
