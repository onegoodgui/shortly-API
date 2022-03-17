import { Router } from "express";
import { login } from "../controllers/authController.js";
import { generateShortUrl } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { verifyUrlExistence } from "../middlewares/verifyUrlExistence.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), verifyUrlExistence, generateShortUrl);
export default urlRouter;