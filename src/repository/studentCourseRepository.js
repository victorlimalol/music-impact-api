import con from "./connection.js";

export async function associateStudentToCourse(studentId, courseId) {
  const comando = `
    INSERT INTO students_courses (student_id, course_id) VALUES (?, ?)
  `;

  try {
    const resposta = await con.query(comando, [studentId, courseId]);
    return resposta[0].insertId;
  } catch (error) {
    console.error("Error associating student to course:", error);
    throw new Error("Failed to associate student to course");
  }
}

export async function getCoursesByStudentId(studentId) {
  const comando = `
    SELECT course_id FROM students_courses WHERE student_id = ?
  `;

  try {
    const resposta = await con.query(comando, [studentId]);
    return resposta[0].map(row => row.course_id);
  } catch (error) {
    console.error("Error fetching courses for student:", error);
    throw new Error("Failed to fetch courses for student");
  }
}

export async function removeStudentFromAllCourses(studentId) {
  const coursesByStudentId = await getCoursesByStudentId(studentId);

  await Promise.all(coursesByStudentId.map(async (courseId) => {
    await removeStudentFromCourse(studentId, courseId);
  }));

  return true;
}

export async function removeStudentFromCourse(studentId, courseId) {
  const comando = `
    DELETE FROM students_courses
    WHERE student_id = ? AND course_id = ?
  `;

  try {
    const resposta = await con.query(comando, [studentId, courseId]);
    return resposta[0].affectedRows > 0;
  } catch (error) {
    console.error("Error removing student from course:", error);
    throw new Error("Failed to remove student from course");
  }
}
