const { connect, ping, sql, after, ...database } = require("./src/mysql");

const utils = require("./src/utils");
const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3333;

const corsOptions = {
  origin: ["http://localhost:5173"],
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
  console.log("RedStore Online >>> " + GetNumPlayerIndices());

  if (config.groupsInTable) {
    sql(`CREATE TABLE IF NOT EXISTS redstore_groups (
      id int(11) NOT NULL AUTO_INCREMENT,
      nome varchar(255) NOT NULL DEFAULT 0,
      PRIMARY KEY (id)
    )
    `);
    sql(` CREATE TABLE IF NOT EXISTS redstore_groups_permissions (
      id int(11) NOT NULL AUTO_INCREMENT,
      idRelation int(11) DEFAULT NULL,
      permissao varchar(255) DEFAULT NULL,
      PRIMARY KEY (id)
    )`);
  }

  sql(utils.createTableCoords());
  sql(utils.createTableHome());

  const response = await sql(`SELECT * FROM redstore_homes`);

  const coordsBlip = await sql(`SELECT * FROM redstore_coords`);

  if (!(response.length > 0)) {
    sql(utils.insertHomes());
  }

  if (coordsBlip.length > 0) {
      emit("listBlipMarks", coordsBlip, true);
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
