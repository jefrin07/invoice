import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getAllPosters
} from "../controllers/posterController.js";

const posterRoutes = express.Router();

posterRoutes.get("/all-posters",protect, getAllPosters);


export default posterRoutes;
