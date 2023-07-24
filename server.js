const { connect, ping, sql, after, ...database } = require("./src/mysql");

const utils = require("./src/utils");
const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3333;

const corsOptions = {
  origin: [
    config.production ? "http://189.127.165.179:5173" : "http://localhost:5173",
  ], // Não remova esse IP, pois caso o faça, seu servidor ficará vulnerável a solicitações.
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

  console.log(`
  _______                 __         ______   __                                
 /       \               /  |       /      \ /  |                               
 $$$$$$$  | ______   ____$$ |      /$$$$$$  _$$ |_    ______   ______   ______  
 $$ |__$$ |/      \ /    $$ |      $$ \__$$/ $$   |  /      \ /      \ /      \ 
 $$    $$</$$$$$$  /$$$$$$$ |      $$      $$$$$$/  /$$$$$$  /$$$$$$  /$$$$$$  |
 $$$$$$$  $$    $$ $$ |  $$ |       $$$$$$  |$$ | __$$ |  $$ $$ |  $$/$$    $$ |
 $$ |  $$ $$$$$$$$/$$ \__$$ |      /  \__$$ |$$ |/  $$ \__$$ $$ |     $$$$$$$$/ 
 $$ |  $$ $$       $$    $$ |      $$    $$/ $$  $$/$$    $$/$$ |     $$       |
 $$/   $$/ $$$$$$$/ $$$$$$$/        $$$$$$/   $$$$/  $$$$$$/ $$/       $$$$$$$/ 
                                                                                
                                                                                
                                                                                
 `);

  await sql(utils.createTableCoords());
  await sql(utils.createTableHome());
  await sql(utils.createTableGroup());
  await sql(utils.createTableGroupHierarquia());
  await sql(utils.createTableGroupUser());
  await sql(utils.createTableHistoryPagament());

  if (base_creative) {
    sql(utils.createTableInteriores());

    const interiores = await sql(`SELECT * FROM redstore_homes_interior`);

    if (!(interiores.length > 0)) {
      await sql(utils.insertTableInteriores());
    }
  }

  const response = await sql(`SELECT * FROM redstore_homes`);

  const coordsBlip = await sql(`SELECT * FROM redstore_coords`);

  if (!(response.length > 0)) {
    if (base_creative) {
      for (let i = 1; i <= 1212; i++) {
        const property = `Propertys${String(i).padStart(4, "0")}`;
        sql(
          `INSERT INTO redstore_homes (id, home) VALUES (${i}, '${property}')`
        );
      }
    } else {
      sql(utils.insertHomes());
    }
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
  onCallbackJogadores();
}

const adminRouter = require("./src/routes/Admin");
const donaterRouter = require("./src/routes/Donater");
const { columns, base_creative } = require("./src/config");
const { onCallbacks, onCallbackJogadores } = require("./src/routes/Salary");

app.use("/donater", donaterRouter);
app.use("/admin", adminRouter);

// Natives
app.get("/connection", (req, res) => {
  res.json({
    connection: true,
  });
});

app.get("/getToken", (req, res) => {
  res.json({ token: config.token });
});

app.get("/admin/players/online", (req, res) => {
  res.json({ quantidade: GetNumPlayerIndices() });
});

start().catch(utils.printError);

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
