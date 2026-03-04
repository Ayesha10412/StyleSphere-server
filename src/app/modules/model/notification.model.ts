import { model, Schema, Types } from "mongoose";
import { INotification } from "../interface/notification.interface";

const notificationSchema=new Schema <INotification>( {
  user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  type: {
    type: String,
    enum: ["order_update", "new_message", "promotion", "system_alert"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
},{timestamps:true,versionKey:false}
)
export const Notification=model<INotification>("Notification",notificationSchema)