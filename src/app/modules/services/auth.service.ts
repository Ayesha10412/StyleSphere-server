import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccesstoken =
    await createNewAccessTokenWithRefreshToken(refreshToken);
  return {
    accessToken: newAccesstoken.accessToken,
  };
};
export const AuthServices={getNewAccessToken}