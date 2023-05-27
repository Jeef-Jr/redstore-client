const { lua } = require("./src/lua");
const { connect, ping, sql, after, ...database } = require("./src/mysql");

const api = require("./src/api");
const utils = require("./src/utils");
const vrp = require("./src/vrp");
const Warning = require("./src/Warning");
const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3333;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8080'], 
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

async function start() {
  console.log("Conectando no banco de dados...");

  let error = undefined;
  while ((error = await connect())) {
    console.error("Falha ao conectar no banco de dados, tentando novamente...");
    utils.printError(error);
  }

  console.log("RedStore >> Conectado ao banco de dados!");
  console.log("RedStore Online>>" + GetNumPlayerIndices());

  setInterval(
    () =>
      ping((err) => {
        if (err) {
          connect().then((err) =>
            console.log(
              err ? "Falha ao reconectar..." : "Conexão estabelecida novamente!"
            )
          );
        }
      }),
    10000
  );
}

const adminRouter = require("./src/routes/Admin");
const mechanicRouter = require("./src/routes/Mechanic");

app.use("/mechanic", mechanicRouter);
app.use("/admin", adminRouter);

// Natives

app.get("/admin/players/online", (req, res) => {
  res.json({ quantidade: GetNumPlayerIndices() });
});

start().catch(utils.printError);

app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
