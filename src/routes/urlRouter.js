import { Router } from "express";
import { login } from "../controllers/authController.js";
import { deleteUrl, findShortUrl, generateShortUrl } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import { verifyUrlExistence } from "../middlewares/verifyUrlExistence.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), verifyUrlExistence, generateShortUrl);
urlRouter.get('/urls/:shortUrl', findShortUrl);
urlRouter.delete('/urls/:id', validateTokenMiddleware, verifyUrlExistence, deleteUrl); 
export default urlRouter;