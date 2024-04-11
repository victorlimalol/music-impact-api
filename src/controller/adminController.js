import {
  createAdmin,
  listAdmins,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  getAdminByEmail,
} from "../repository/adminRepository.js";
import { Router } from "express";

let router = Router();

router.post("/admin/create", async (req, resp) => {
  let data = req.body;

  if (
    !data.name ||
    !data.cpf ||
    !data.date_of_birth ||
    !data.address ||
    !data.phone_number ||
    !data.email ||
    !data.password
  ) {
    return resp
      .status(400)
      .send("Invalid request. Check the data sent and try again.");
  }

  let admin = await createAdmin(data);
  return resp.status(201).send(admin);
});

router.get("/admin/list", async (req, resp) => {
  let admins = await listAdmins();
  return resp.status(200).send(admins);
});

router.get("/admin/:id", async (req, resp) => {
  let adminId = req.params.id;
  let admin = await getAdminById(adminId);

  if (!admin) {
    return resp.status(404).send("Admin not found.");
  }

  return resp.status(200).send(admin);
});

router.delete("/admin/:id", async (req, resp) => {
  let adminId = req.params.id;
  let deleteStatus = await deleteAdmin(adminId);

  if (!deleteStatus) {
    return resp.status(404).send("Admin not found.");
  }

  return resp.status(204).send();
});

router.put("/admin/:id", async (req, resp) => {
  let adminId = req.params.id;
  let data = req.body;

  if (
    !data.name ||
    !data.cpf ||
    !data.date_of_birth ||
    !data.address ||
    !data.phone_number ||
    !data.email ||
    !data.password
  ) {
    return resp
      .status(400)
      .send("Invalid request. Check the data sent and try again.");
  }

  let updateStatus = await updateAdmin(adminId, data);
  if (!updateStatus) {
    return resp.status(404).send("Admin not found.");
  }

  return resp.status(200).send(updateStatus);
});

router.post("/admin/login", async (req, resp) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return resp
      .status(400)
      .send("Invalid request. Check the data sent and try again.");
  }
  let admin = await getAdminByEmail(email);

  if (!admin) {
    return resp.status(404).send("Admin not found.");
  }

  if (admin.password !== password) {
    return resp.status(401).send("Invalid password.");
  }

  return resp.status(200).send("Login successful.");
});

export default router;
