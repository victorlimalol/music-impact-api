import { getCourseById } from "../repository/courseRepository.js";
import { associateStudentToCourse, getCoursesByStudentId, removeStudentFromAllCourses } from "../repository/studentCourseRepository.js";
import {
  createStudent,
  listStudents,
  deleteStudent,
  updateStudent,
  getStudentByIdWithCourses,
  getStudentById,
} from "../repository/studentRepository.js";
import { Router } from "express";
let router = Router();

router.post("/students/register", async (req, resp) => {
  let data = req.body;

  console.log(data)

  if (
    !data.name ||
    !data.cpf ||
    !data.date_of_birth ||
    !data.address ||
    !data.phone_number ||
    !data.courses ||
    !data.email
  ) {
    return resp
      .status(400)
      .send("Request is invalid. Check the data sent and try again.");
  }

  let student = await createStudent({
    name: data.name,
    cpf: data.cpf,
    date_of_birth: data.date_of_birth,
    address: data.address,
    phone_number: data.phone_number,
    email: data.email
  });

  let courses = data.courses;

  if (Array.isArray(courses)) {
    courses.map(async (course) => {
      const courseExists = await getCourseById(course)
      if (!courseExists) return

      const studentCourse = await associateStudentToCourse(student.id, course)
      console.log(studentCourse)
    })
  }

  return resp.status(201).send(student);
});

router.get("/students", async (req, resp) => {
  let query = req.query

  console.log(query)
  let students = await listStudents(query);
  console.log(students)
  return resp.status(200).send(students);
});

router.get("/students/:id", async (req, resp) => {
  let idStudent = req.params.id;

  let student = await getStudentById(idStudent);
  let coursesByStudentId = await getCoursesByStudentId(idStudent);

  const courses = await Promise.all(coursesByStudentId.map(async (courseId) => {
    const courseItem = await getCourseById(courseId);
    return courseItem;
  }));

  if (!student) {
    return resp
      .status(400)
      .send("Request is invalid. Check the data sent and try again.");
  }

  return resp.status(200).send({
    ...student,
    courses: courses
  });
});


router.delete("/students/:id", async (req, resp) => {
  try {
    const studentId = req.params.id;

    const deleted = await deleteStudent(studentId);
    if (!deleted) {
      return resp.status(404).send("Student not found.");
    }

    return resp.status(200).send("Student deleted successfully.");
  } catch (error) {
    console.error("Error deleting student:", error);
    return resp.status(500).send("Internal server error.");
  }
})

router.put("/students/:id", async (req, resp) => {
  try {
    let idStudent = req.params.id;
    let data = req.body;

    console.log(data)

    if (
      !data.name ||
      !data.cpf ||
      !data.date_of_birth ||
      !data.address ||
      !data.phone_number ||
      !data.courses ||
      !data.email
    ) {
      return resp
        .status(400)
        .send("Request is invalid. Check the data sent and try again.");
    }

    const studentUpdated = await updateStudent(idStudent, {
      name: data.name,
      cpf: data.cpf,
      date_of_birth: data.date_of_birth,
      address: data.address,
      phone_number: data.phone_number,
      email: data.email
    });

    if (data.courses && Array.isArray(data.courses)) {
      // Desassocie todos os cursos anteriores do aluno
      await removeStudentFromAllCourses(idStudent);

      // Associe os novos cursos ao aluno
      await Promise.all(data.courses.map(async (courseId) => {
        const courseExists = await getCourseById(courseId);
        if (courseExists) {
          await associateStudentToCourse(idStudent, courseId);
        }
      }));
    }

    return resp.status(200).send("Student updated successfully.");
  } catch (error) {
    console.error("Error updating student:", error);
    return resp.status(500).send("Internal server error.");
  }
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
