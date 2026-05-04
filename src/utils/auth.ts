import {
  getDevToken as devToken,
  redirectToGoogleLogin as devRedirect,
  clearDevToken as devClearToken,
} from "./devAuth";
import {
  getDevToken as prodToken,
  redirectToGoogleLogin as prodRedirect,
  clearDevToken as prodClearToken,
} from "./prodAuth";
import { isDevMode } from "../config/keys";

const getDevToken = isDevMode ? devToken : prodToken;
const redirectToGoogleLogin = isDevMode ? devRedirect : prodRedirect;
const clearDevToken = isDevMode ? devClearToken : prodClearToken;

export { getDevToken, redirectToGoogleLogin, clearDevToken };
