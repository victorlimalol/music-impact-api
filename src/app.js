import clienteController from "./controller/clienteController.js";
import usuarioController from "./controller/usuarioController.js";
import orcamentoController from "./controller/orcamentoController.js";

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(clienteController);
app.use(usuarioController);
app.use(orcamentoController);

let port = process.env.PORT;
app.listen(port, () => console.log("API SUBIU!"));
