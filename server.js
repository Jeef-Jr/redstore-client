const { connect, ping, sql, after, ...database } = require("./src/mysql");

const utils = require("./src/utils");
const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3333;

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
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

  if (config.groupsInTable) {
    sql(`CREATE TABLE IF NOT EXISTS redstore_groups (
      id BIGINT NOT NULL AUTO_INCREMENT,
      nome varchar(255) NOT NULL DEFAULT 0,
       permission varchar(255) DEFAULT NULL,
       permission_2 varchar(255) DEFAULT NULL,
       permission_3 varchar(255) DEFAULT NULL,
      permission_4 varchar(255) DEFAULT NULL,
      permission_5 varchar(255) DEFAULT NULL,
      PRIMARY KEY (id)
    )`);
  }

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

app.get("/connection", (req, res) => {
  res.json({
    connection: true,
  });
});

app.get("/admin/players/online", (req, res) => {
  res.json({ quantidade: GetNumPlayerIndices() });
});

start().catch(utils.printError);

app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
