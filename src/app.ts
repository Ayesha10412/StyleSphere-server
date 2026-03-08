import express, { Request, Response } from "express";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
<<<<<<< HEAD
=======
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
>>>>>>> d77f87a (Initial commit without secrets)
const app = express();
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  }),
);
app.use("/api",router)
app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Welcome to StyleSphere Backend"
    })
})
 app.use(globalErrorHandler)
 app.use(notFound)
export default app;
