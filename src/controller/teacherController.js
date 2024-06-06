import { getCourseById } from "../repository/courseRepository.js";
import { getCoursesByStudentId } from "../repository/studentCourseRepository.js";
import { associateTeacherToCourse, getCoursesByTeacherId, removeTeacherFromAllCourses } from "../repository/teacherCourseRepository.js";
import {
  createTeacher,
  listTeachers,
  deleteTeacher,
  updateTeacher,
  getTeacherByIdWithCourses,
  getTeacherById,
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

  let courses = data.courses;

  if (Array.isArray(courses)) {
    courses.map(async (course) => {
      const courseExists = await getCourseById(course)
      if (!courseExists) return

      const teacherCourse = await associateTeacherToCourse(teacher.id, course)
    })
  }

  return resp.status(201).send(teacher);
});

router.get("/teacher/list", async (req, resp) => {
  let query = req.query
  let teachers = await listTeachers(query);
  return resp.status(200).send(teachers);
});

router.get("/teacher/:id", async (req, resp) => {
  let teacherId = req.params.id;

  let teacher = await getTeacherById(teacherId);
  let coursesByTeacherId = await getCoursesByTeacherId(teacherId);

  const courses = await Promise.all(coursesByTeacherId.map(async (courseId) => {
    const courseItem = await getCourseById(courseId);
    return courseItem;
  }));

  if (!teacher) {
    return resp.status(404).send("Teacher not found.");
  }

  return resp.status(200).send({
    ...teacher,
    courses: courses
  });
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

  console.log(data)

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

  let updateStatus = await updateTeacher(teacherId, {
    name: data.name,
    cpf: data.cpf,
    date_of_birth: data.date_of_birth,
    address: data.address,
    phone_number: data.phone_number,
    email: data.email
  });

  if (data.courses && Array.isArray(data.courses)) {
    // Desassocie todos os cursos anteriores do aluno
    await removeTeacherFromAllCourses(teacherId);

    // Associe os novos cursos ao aluno
    await Promise.all(data.courses.map(async (courseId) => {
      const courseExists = await getCourseById(courseId);
      if (courseExists) {
        await associateTeacherToCourse(teacherId, courseId);
      }
    }));
  }

  return resp.status(200).send("Student updated successfully.");
});

export default router;
