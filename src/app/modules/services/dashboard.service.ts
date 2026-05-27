import { Coupon } from "../model/coupon.model";
import { Order } from "../model/order.model";
import { Product } from "../model/product.model";
import { User } from "../model/user.models";

const dashboard = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalCoupons = await Coupon.countDocuments();
  const totalRevenue = await Order.aggregate([
    {
      $match: {
        status: "completed",
      },
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);
  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalCoupons,
    totalRevenue: totalRevenue[0]?.total || 0,
  };
};
export const DashboardService = {
    dashboard,
}