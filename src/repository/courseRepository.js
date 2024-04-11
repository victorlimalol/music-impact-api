import con from "./connection.js";

export async function createCourse(course) {
  let { name, modality, description } = course;

  let query = `
    INSERT INTO courses (name, modality, description) 
    VALUES (?, ?, ?)
  `;

  let response = await con.query(query, [name, modality, description]);
  let info = response[0];

  course.id = info.insertId;
  return course;
}

export async function updateCourse(courseId, updatedCourseData) {
  const { name, modality, description } = updatedCourseData;

  let query = `
    UPDATE courses
    SET name = ?, modality = ?, description = ?
    WHERE id = ?
  `;

  let response = await con.query(query, [
    name,
    modality,
    description,
    courseId,
  ]);
  return response[0].affectedRows > 0;
}

export async function deleteCourse(courseId) {
  let query = `
    DELETE FROM courses
    WHERE id = ?
  `;

  let response = await con.query(query, [courseId]);
  return response[0].affectedRows > 0;
}

export async function listCourses() {
  let query = `
    SELECT * FROM courses
  `;

  let response = await con.query(query);
  return response[0];
}
