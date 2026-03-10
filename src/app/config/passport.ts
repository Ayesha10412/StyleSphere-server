import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/model/user.models";
import bcryptjs from "bcryptjs";
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "User does not exist!" });
        }
        const isGoogleAuthenticate = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google",
        );
        if (isGoogleAuthenticate) {
          return done(null, false, {
            message:
              "You've authenticated through Google. So, if you want to login with credentials then at first login with google then set email and password; then you can login with credentials.",
          });
        }
        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string,
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match!" });
        }
        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    },
  ),
);
