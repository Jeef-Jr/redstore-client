const express = require("express");
const router = express.Router();
const vrp = require("../vrp");
const { sql } = require("../mysql");

function messageSuccess(id, message) {
  new Promise(() => {
    emit("emitirNotify", id, "sucesso", message);
  });
}

router.post("/gerarCodigo", async (req, res) => {
  const { id, codigo } = req.body;

  // const isOnline = await vrp.getIsOnline(id);

  // if (!isOnline) {
  //   res.json({ info: false });
  //   return;
  // }

  const dados = await sql(
    `SELECT user_id FROM redstore_donater WHERE user_id = ?`,
    [id]
  );

  if (dados.length > 0) {
    await sql(`UPDATE redstore_donater SET codigo = ? WHERE user_id = ?`, [
      codigo,
      id,
    ]);
  } else {
    await sql(`INSERT INTO redstore_donater (codigo, user_id) VALUES (?, ?)`, [
      codigo,
      id,
    ]);
  }

  messageSuccess(id, `Seu código de autenticação : <b>${codigo}</b>`);

  res.json({
    info: true,
  });
});

router.post("/confirmarCodigo", async (req, res) => {
  const { id, codigo } = req.body;

  const dados = await sql(`SELECT * FROM redstore_donater WHERE user_id = ?`, [
    id,
  ]);

  if (dados.length > 0) {
    if (dados[0].codigo === codigo) {
      res.json({ ...dados[0], info: true });
    } else {
      res.json({
        info: false,
      });
    }
  }
});

router.get("/getInformationUser/:id", async (req, res) => {
  const { id } = req.params;

  const dados = await sql(`SELECT * FROM redstore_donater WHERE user_id = ?`, [
    id,
  ]);

  res.json(dados);
});

module.exports = router;
