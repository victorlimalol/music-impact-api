import con from "./connection.js";

const STUDENT_TABLE = "students";
const COURSES_TABLE = "courses"
const STUDENT_COURSES_TABLE = "students_courses"
const STUDENT_COLUMNS = [
  "name",
  "cpf",
  "date_of_birth",
  "address",
  "phone_number",
  "email"
];

export async function createStudent(student) {
  const { name, cpf, date_of_birth, address, phone_number, email } = student;

  const comando = `
    INSERT INTO ${STUDENT_TABLE} (${STUDENT_COLUMNS.join(", ")}) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const resposta = await con.query(comando, [
    name,
    cpf,
    date_of_birth,
    address,
    phone_number,
    email
  ]);
  const info = resposta[0];

  student.id = info.insertId;
  return student;
}

// List all students
export async function listStudents(query) {
  let comando = `
    SELECT 
      s.*,
      GROUP_CONCAT(c.name) AS courses
    FROM 
      ${STUDENT_TABLE} s
    LEFT JOIN 
      ${STUDENT_COURSES_TABLE} sc ON s.id = sc.student_id
    LEFT JOIN 
      ${COURSES_TABLE} c ON sc.course_id = c.id
  `;

  let conditions = [];

  if (query.course) {
    conditions.push(`sc.course_id = '${query.course}'`);
  }

  if (query.term) {
    conditions.push(`s.name LIKE '${query.term}%'`);
  }

  if (conditions.length > 0) {
    comando += ` WHERE ${conditions.join(' AND ')}`;
  }

  comando += ` GROUP BY s.id`;

  const resposta = await con.query(comando);
  return resposta[0];
}

export async function updateStudent(studentId, updatedStudentData) {
  const { name, cpf, date_of_birth, address, phone_number, email } =
    updatedStudentData;

  const comando = `
    UPDATE ${STUDENT_TABLE}
    SET name = ?, cpf = ?, date_of_birth = ?, address = ?, phone_number = ?, email = ?
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [
    name,
    cpf,
    date_of_birth,
    address,
    phone_number,
    email,
    studentId,
  ]);

  return resposta[0].affectedRows > 0;
}


// Get a student by id
export async function getStudentById(studentId) {
  const comando = `
    SELECT * FROM ${STUDENT_TABLE}
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [studentId]);
  return resposta[0][0];
}

export async function getStudentByCpf(cpf) {
  const comando = `
    SELECT * FROM ${STUDENT_TABLE}
    WHERE cpf = ?
  `;

  const resposta = await con.query(comando, [cpf]);
  return resposta[0][0];
}

export async function deleteStudent(studentId) {
  const comando = `
    DELETE FROM ${STUDENT_TABLE}
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [studentId]);
  return resposta[0].affectedRows > 0;
}


export async function getStudentByIdWithCourses(studentId) {
  const comando = `
    SELECT students.*, courses.*
    FROM students
    LEFT JOIN students_courses ON students.id = students_courses.student_id
    LEFT JOIN courses ON students_courses.course_id = courses.id
    WHERE students.id = ?
  `;

  try {
    const resposta = await con.query(comando, [studentId]);
    return resposta[0];
  } catch (error) {
    return null;
  }
}
