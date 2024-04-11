import {
  createStudent,
  listStudents,
  deleteStudent,
  updateStudent,
  getStudentByIdWithCourses,
} from "../repository/studentRepository.js";
import { Router } from "express";
let router = Router();

router.post("/students/register", async (req, resp) => {
  let data = req.body;

  if (
    !data.name ||
    !data.cpf ||
    !data.date_of_birth ||
    !data.address ||
    !data.phone_number
  ) {
    return resp
      .status(400)
      .send("Request is invalid. Check the data sent and try again.");
  }

  let student = await createStudent(data);

  return resp.status(201).send(student);
});

router.get("/students", async (req, resp) => {
  let students = await listStudents();
  return resp.status(200).send(students);
});

router.get("/students/:id", async (req, resp) => {
  let idStudent = req.params.id;
  let student = await getStudentByIdWithCourses(idStudent);

  if (!student) {
    return resp
      .status(400)
      .send("Request is invalid. Check the data sent and try again.");
  }

  return resp.status(200).send(student);
});

router.delete("/students/:id", async (req, resp) => {
  let idStudent = req.params.id;
  let deleteStatus = await deleteStudent(idStudent);

  if (!deleteStatus) {
    return resp
      .status(400)
      .send("Request is invalid. Check the id, and try again");
  }

  return resp.status(200);
});

router.put("/students/:id", async (req, resp) => {
  let idStudent = req.params.id;
  let data = req.body;

  if (
    !data.name ||
    !data.cpf ||
    !data.date_of_birth ||
    !data.address ||
    !data.phone_number
  ) {
    return resp
      .status(400)
      .send("Request is invalid. Check the data sent and try again.");
  }

  let updateStatus = await updateStudent(data, idStudent);

  return resp.status(200);
});

router.post("/student/:studentId/course/:courseId", async (req, resp) => {
  const { studentId, courseId } = req.params;

  try {
    const associationId = await associateStudentToCourse(studentId, courseId);
    return resp.status(201).send({ id: associationId });
  } catch (error) {
    console.error("Error associating student to course:", error);
    return resp.status(500).send("Failed to associate student to course");
  }
});

export default router;
