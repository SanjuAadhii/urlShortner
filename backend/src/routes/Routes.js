import express from "express";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
import {
  signIn,
  signUp,
  resetPassword,
  submitNewPassword,
  activateAccount,
} from "../controllers/authController.js";
import {
  shorten,
  redirect,
  userUrls,
  deleteUrl,
} from "../controllers/urlControllers.js";
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/reset/:token", submitNewPassword);
router.post("/auth/activate/:token", activateAccount);
router.get("/auth/validatetoken", auth, (req, res) => {
  res.status(200).json({ msg: "Token is valid" });
});
router.post("/api/shorten", shorten);
router.get("/:shortUrl", redirect);
router.get("/api/user-urls", auth, userUrls);
router.delete("/api/urls/:urlId", auth, deleteUrl);
export default router;
