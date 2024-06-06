import con from "./connection.js";

export async function associateTeacherToCourse(teacherId, courseId) {
  const comando = `
      INSERT INTO teachers_courses (teacher_id, course_id) VALUES (?, ?)
    `;

  try {
    const resposta = await con.query(comando, [teacherId, courseId]);
    return resposta[0].insertId;
  } catch (error) {
    console.error("Error associating teacher to course:", error);
    throw new Error("Failed to associate teacher to course");
  }
}

export async function getCoursesByTeacherId(teacherId) {
  const comando = `
    SELECT course_id FROM teachers_courses WHERE teacher_id = ?
  `;

  try {
    const resposta = await con.query(comando, [teacherId]);
    return resposta[0].map(row => row.course_id);
  } catch (error) {
    console.error("Error fetching courses for teacher:", error);
    throw new Error("Failed to fetch courses for teacher");
  }
}

export async function removeTeacherFromAllCourses(teacherId) {
  const coursesByTeacherId = await getCoursesByTeacherId(teacherId);

  await Promise.all(coursesByTeacherId.map(async (courseId) => {
    await removeTeacherFromCourse(teacherId, courseId);
  }));

  return true;
}

export async function removeTeacherFromCourse(teacherId, courseId) {
  const comando = `
      DELETE FROM teachers_courses
      WHERE teacher_id = ? AND course_id = ?
    `;

  try {
    const resposta = await con.query(comando, [teacherId, courseId]);
    return resposta[0].affectedRows > 0;
  } catch (error) {
    console.error("Error removing teacher from course:", error);
    throw new Error("Failed to remove teacher from course");
  }
}
