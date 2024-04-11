import con from "./connection.js";

const ADMIN_TABLE = "admins";
const ADMIN_COLUMNS = [
  "name",
  "cpf",
  "date_of_birth",
  "address",
  "phone_number",
  "email",
  "password",
];

export async function createAdmin(admin) {
  const { name, cpf, date_of_birth, address, phone_number, email, password } =
    admin;

  const comando = `
    INSERT INTO ${ADMIN_TABLE} (${ADMIN_COLUMNS.join(", ")}) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const resposta = await con.query(comando, [
    name,
    cpf,
    date_of_birth,
    address,
    phone_number,
    email,
    password,
  ]);
  const info = resposta[0];

  admin.id = info.insertId;
  return admin;
}

export async function listAdmins() {
  const comando = `
    SELECT * FROM ${ADMIN_TABLE}
  `;

  const resposta = await con.query(comando);
  return resposta[0];
}

export async function deleteAdmin(adminId) {
  const comando = `
    DELETE FROM ${ADMIN_TABLE}
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [adminId]);
  return resposta[0].affectedRows > 0;
}

export async function updateAdmin(adminId, updatedAdminData) {
  const { name, cpf, date_of_birth, address, phone_number, email, password } =
    updatedAdminData;

  const comando = `
    UPDATE ${ADMIN_TABLE}
    SET name = ?, cpf = ?, date_of_birth = ?, address = ?, phone_number = ?, email = ?, password = ?
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [
    name,
    cpf,
    date_of_birth,
    address,
    phone_number,
    email,
    password,
    adminId,
  ]);
  return resposta[0].affectedRows > 0;
}

export async function getAdminById(adminId) {
  const comando = `
    SELECT * FROM ${ADMIN_TABLE}
    WHERE id = ?
  `;

  const resposta = await con.query(comando, [adminId]);
  return resposta[0][0];
}

export async function getAdminByCpf(cpf) {
  const comando = `
    SELECT * FROM ${ADMIN_TABLE}
    WHERE cpf = ?
  `;

  const resposta = await con.query(comando, [cpf]);
  return resposta[0][0];
}

export async function getAdminByEmail(email) {
  const comando = `
      DELETE FROM ${ADMIN_TABLE}
      WHERE email = ?
    `;

  const resposta = await con.query(comando, [email]);
  return resposta[0].affectedRows > 0;
}
