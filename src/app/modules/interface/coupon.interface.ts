export enum DiscountType{
    PERCENTAGE="percentage",
    FIXED="fixed"
}
export interface ICoupon{
    code:string;
    discountType:DiscountType;
    value:number;
    minPurchase?:number;
    expiryDate:Date;
    usageLimit:number;
    usedCount?:number;
    isActive?:boolean;
    
}