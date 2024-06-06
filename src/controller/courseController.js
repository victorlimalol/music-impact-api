import {
  createCourse,
  listCourses,
  getCourseById,
  deleteCourse,
  updateCourse,
} from "../repository/courseRepository.js";
import { Router } from "express";

let router = Router();

router.post("/course/create", async (req, resp) => {
  let data = req.body;

  console.log(data)

  if (!data.name || !data.modality || !data.description) {
    return resp
      .status(400)
      .send("Invalid request. Check the data sent and try again.");
  }

  let course = await createCourse(data);

  return resp.status(201).send(course);
});

router.get("/course/list", async (req, resp) => {
  let courses = await listCourses();
  return resp.status(200).send(courses);
});

router.get("/course/:id", async (req, resp) => {
  let courseId = req.params.id;
  let course = await getCourseById(courseId);

  if (!course) {
    return resp.status(404).send("Course not found.");
  }

  return resp.status(200).send(course);
});

router.delete("/course/:id", async (req, resp) => {
  let courseId = req.params.id;
  let deleteStatus = await deleteCourse(courseId);

  if (!deleteStatus) {
    return resp.status(404).send("Course not found.");
  }

  return resp.status(204).send();
});

router.put("/course/:id", async (req, resp) => {
  let courseId = req.params.id;
  let data = req.body;

  if (!data.name || !data.modality || !data.description) {
    return resp
      .status(400)
      .send("Invalid request. Check the data sent and try again.");
  }

  let updateStatus = await updateCourse(courseId, data);

  if (!updateStatus) {
    return resp.status(404).send("Course not found.");
  }

  return resp.status(200).send(updateStatus);
});

export default router;
