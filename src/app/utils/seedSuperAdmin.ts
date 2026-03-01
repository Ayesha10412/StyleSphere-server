import { envVars } from "../config/env";
import {
  IAuthProviders,
  IUser,
  ROLE,
} from "../modules/interface/user.interface";
import { User } from "../modules/model/user.models";
import bcryptjs from "bcryptjs";
export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      console.log("Super admin already exist!");
      return;
    }
    const hanshedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND),
    );
    const authProvider: IAuthProviders = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };
    const payload: IUser = {
      name: "Super Admin",
      role: ROLE.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hanshedPassword,
      isVerified: true,
      auths: [authProvider],
    };
    const superAdmin = await User.create(payload);
    console.log("Super admin created successfully!");
    return superAdmin;
  } catch (error) {
    console.log(error);
  }
};
