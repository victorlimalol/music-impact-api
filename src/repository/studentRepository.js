import con from "./connection.js";

const STUDENT_TABLE = "students";
const STUDENT_COLUMNS = [
  "name",
  "cpf",
  "date_of_birth",
  "address",
  "phone_number",
];

export async function createStudent(student) {
  const { name, cpf, date_of_birth, address, phone_number } = student;

  const comando = `
    INSERT INTO ${STUDENT_TABLE} (${STUDENT_COLUMNS.join(", ")}) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const resposta = await con.query(comando, [
    name,
    cpf,
    date_of_birth,
    address,
    phone_number,
  ]);
  const info = resposta[0];

  student.id = info.insertId;
  return student;
}

// List all students
export async function listStudents() {
  const comando = `
    SELECT * FROM ${STUDENT_TABLE}
  `;

  const resposta = await con.query(comando);
  return resposta[0];
}

// Delete a student by id
export async function deleteStudent(studentId) {
  const comando = `
    DELETE FROM ${STUDENT_TABLE}
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [studentId]);
  return resposta[0].affectedRows > 0;
}

// Update a student by id
export async function updateStudent(studentId, updatedStudentData) {
  const { name, cpf, date_of_birth, address, phone_number } =
    updatedStudentData;

  const comando = `
    UPDATE ${STUDENT_TABLE}
    SET name = ?, cpf = ?, date_of_birth = ?, address = ?, phone_number = ?
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [
    name,
    cpf,
    date_of_birth,
    address,
    phone_number,
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
