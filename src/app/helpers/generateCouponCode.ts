import { Coupon } from "../modules/model/coupon.model";

const couponCode = (length = 6): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "C";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
};
export const generateCouponCode = async (): Promise<string> => {
  let code = "";
  let exists = true;
  while (exists) {
    code = couponCode(6);
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      exists = false;
    }
  }
  return code;
};
