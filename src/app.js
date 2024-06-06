import 'dotenv/config'

import adminController from "./controller/adminController.js";
import courseController from "./controller/courseController.js";
import studentsController from "./controller/studentsController.js";
import teacherController from "./controller/teacherController.js";

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(adminController);
app.use(courseController);
app.use(studentsController);
app.use(teacherController);

let port = process.env.PORT;
app.listen(port, () => console.log("API SUBIU!"));
