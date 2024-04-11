import {
  createTeacher,
  listTeachers,
  deleteTeacher,
  updateTeacher,
  getTeacherByIdWithCourses,
} from "../repository/teacherRepository.js";
import { Router } from "express";

let router = Router();

router.post("/teacher/create", async (req, resp) => {
  let data = req.body;

  if (
    !data.name ||
    !data.cpf ||
    !data.date_of_birth ||
    !data.address ||
    !data.phone_number ||
    !data.email
  ) {
    return resp
      .status(400)
      .send("Invalid request. Check the data sent and try again.");
  }

  let teacher = await createTeacher(data);

  return resp.status(201).send(teacher);
});

router.get("/teacher/list", async (req, resp) => {
  let teachers = await listTeachers();
  return resp.status(200).send(teachers);
});

router.get("/teacher/:id", async (req, resp) => {
  let teacherId = req.params.id;
  let teacher = await getTeacherByIdWithCourses(teacherId);

  if (!teacher) {
    return resp.status(404).send("Teacher not found.");
  }

  return resp.status(200).send(teacher);
});

router.delete("/teacher/:id", async (req, resp) => {
  let teacherId = req.params.id;
  let deleteStatus = await deleteTeacher(teacherId);

  if (!deleteStatus) {
    return resp.status(404).send("Teacher not found.");
  }

  return resp.status(204).send();
});

router.put("/teacher/:id", async (req, resp) => {
  let teacherId = req.params.id;
  let data = req.body;

  if (
    !data.name ||
    !data.cpf ||
    !data.date_of_birth ||
    !data.address ||
    !data.phone_number ||
    !data.email
  ) {
    return resp
      .status(400)
      .send("Invalid request. Check the data sent and try again.");
  }

  let updateStatus = await updateTeacher(data, teacherId);
  return resp.status(200).send(updateStatus);
});

export default router;
