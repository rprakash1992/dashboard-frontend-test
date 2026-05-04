import {
  getDevToken as devToken,
  redirectToGoogleLogin as devRedirect,
  clearDevToken as devClearToken,
  handleOAuthCallback as devHandleOAuthCallback,
} from "./devAuth";
import {
  getDevToken as prodToken,
  redirectToGoogleLogin as prodRedirect,
  clearDevToken as prodClearToken,
  handleOAuthCallback as prodHandleOAuthCallback,
} from "./prodAuth";
import { isDevMode } from "../config/keys";

const getDevToken = isDevMode ? devToken : prodToken;
const redirectToGoogleLogin = isDevMode ? devRedirect : prodRedirect;
const clearDevToken = isDevMode ? devClearToken : prodClearToken;
const handleOAuthCallback = isDevMode
  ? devHandleOAuthCallback
  : prodHandleOAuthCallback;

export {
  getDevToken,
  redirectToGoogleLogin,
  clearDevToken,
  handleOAuthCallback,
};
