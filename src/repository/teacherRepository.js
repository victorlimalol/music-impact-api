import con from "./connection.js";

const TEACHER_TABLE = 'teachers'
const TEACHER_COURSES_TABLE = 'teachers_courses'
const COURSES_TABLE = 'courses'

export async function createTeacher(teacher) {
  let { name, address, cpf, date_of_birth, phone_number, email } = teacher;

  let query = `
    INSERT INTO teachers (name, cpf, date_of_birth, address, phone_number, email) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  let response = await con.query(query, [
    name,
    cpf,
    date_of_birth,
    address,
    phone_number,
    email,
  ]);
  let info = response[0];

  teacher.id = info.insertId;
  return teacher;
}

export async function listTeachers(query) {
  let comando = `
    SELECT 
      t.*,
      GROUP_CONCAT(c.name) AS courses
    FROM 
      ${TEACHER_TABLE} t
    LEFT JOIN 
      ${TEACHER_COURSES_TABLE} tc ON t.id = tc.teacher_id
    LEFT JOIN 
      ${COURSES_TABLE} c ON tc.course_id = c.id
  `;

  let conditions = [];

  if (query.course) {
    conditions.push(`tc.course_id = '${query.course}'`);
  }

  if (query.term) {
    conditions.push(`t.name LIKE '${query.term}%'`);
  }

  if (conditions.length > 0) {
    comando += ` WHERE ${conditions.join(' AND ')}`;
  }

  comando += ` GROUP BY t.id`;

  const resposta = await con.query(comando);
  return resposta[0];
}


export async function deleteTeacher(teacherId) {
  let query = `
    DELETE FROM teachers
    WHERE id = ?
  `;

  let response = await con.query(query, [teacherId]);
  return response[0].affectedRows > 0;
}

export async function updateTeacher(teacherId, updatedTeacherData) {
  const { name, address, cpf, date_of_birth, phone_number, email } =
    updatedTeacherData;

  let query = `
    UPDATE teachers
    SET name = ?, address = ?, cpf = ?, date_of_birth = ?, phone_number = ?, email = ?
    WHERE id = ?
  `;

  let response = await con.query(query, [
    name,
    address,
    cpf,
    date_of_birth,
    phone_number,
    email,
    teacherId,
  ]);
  return response[0].affectedRows > 0;
}

export async function getTeacherById(teacherId) {
  let query = `
    SELECT * FROM teachers
    WHERE id = ?
  `;

  let response = await con.query(query, [teacherId]);
  return response[0][0];
}

export async function getTeacherByIdWithCourses(teacherId) {
  const comando = `
    SELECT teachers.*, courses.*
    FROM teachers
    LEFT JOIN teachers_courses ON teachers.id = teachers_courses.teacher_id
    LEFT JOIN courses ON teachers_courses.course_id = courses.id
    WHERE teachers.id = ?
  `;

  try {
    const resposta = await con.query(comando, [teacherId]);
    return resposta[0];
  } catch (error) {
    return null;
  }
}
