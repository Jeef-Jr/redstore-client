const express = require("express");
const router = express.Router();
const vrp = require("../vrp");
const { sql } = require("../mysql");
const { columns } = require("../config");

// Functions Callback

function getCoords(id, callback) {
  emit("getCoords", id, callback);
}

function messageSuccess(id, message) {
  new Promise(() => {
    emit("emitirNotify", id, "sucesso", message);
  });
}

function messageFail(id, message) {
  new Promise(() => {
    emit("emitirNotify", id, "negado", message);
  });
}

// Routers

router.post("/placa", async (req, res) => {
  const { id, placa } = req.body;

  new Promise(() => {
    emit("trocarPlacaVeh", id, placa);
  });
  res.json({ message: "modifyPlaca." });
});

router.post("/inventory", async (req, res) => {
  const { id, item, quantidades } = req.body;

  if (quantidades > 0) {
    await vrp.addInventory(id, item, quantidades);

    messageSuccess(
      id,
      `Foi adicionado (<b>${quantidades} ${
        quantidades > 1 ? "unidades" : "unidade"
      }</b>) de <b>${item}</b> no seu inventário.`
    );

    res.json({
      mensagem: "addInventory",
    });
  } else {
    messageFail(id, `A quantidade é inválida.`);

    res.status(400).json({
      mensagem: "Not Add inventory",
    });
  }
});

router.post("/banco", async (req, res) => {
  const { id, value } = req.body;

  if (value > 0) {
    await vrp.addBank(id, value);

    messageSuccess(id, `Foi adicionado <b>R$ ${value} </b> na sua conta.`);

    res.json({
      mensagem: "bank Add",
    });
  } else {
    messageFail(id, "A quantidade é inválida.");
    res.status(400).json({
      mensagem: "Not bank Add",
    });
  }
});

router.post("/spawnCar", async (req, res) => {
  const { id, vehicle } = req.body;

  new Promise(() => {
    emit("spawnCar", id, vehicle);
  });

  res.json({
    message: "vehicle generated successfully",
  });
});

router.post("/addCar", async (req, res) => {
  const { idRecebidor, idAdmin, vehicle } = req.body;

  const dados = await sql(
    `SELECT * FROM ${columns.vehicles} AS VH WHERE VH.user_id = ${idRecebidor} AND VH.vehicle = '${vehicle}'`
  );

  if (dados.length > 0) {
    messageFail(idAdmin, "O usuário já possuí este veículo.");

    res.status(409).json({
      mesagem: "user already has vehicle",
    });
    return;
  }

  await sql(
    `INSERT INTO ${columns.vehicles} (user_id, vehicle, ipva) VALUES (${idRecebidor}, '${vehicle}', NOW())`
  );

  messageSuccess(
    idAdmin,
    `Você presentiou o jogador do id: <b>${idRecebidor}</b> com um veículo.`
  );
  messageSuccess(
    idRecebidor,
    "Parabêns, você foi presentiado com um veículo, confira sua garagem."
  );

  res.json({
    message: "Car add for user",
  });
});

router.get("/coords/:id", (req, res) => {
  const { id } = req.params;

  const player = vrp.getId(id);

  if (player) {
    getCoords(id, (position) => {
      if (position) {
        res.json(position);
      } else {
        res
          .status(404)
          .json("Não foi possível obter as coordenadas do jogador.");
      }
    });
  } else {
    res.status(404).json({ error: "Jogador não encontrado" });
  }
});

router.delete("/limpartInvUser/:idUser/:IdAdmin", (req, res) => {
  const { idUser, IdAdmin } = req.params;

  const player = vrp.getId(idUser);

  if (player) {
    new Promise(() => {
      emit("limparInv", idUser);
    });

    messageSuccess(idUser, "Seu inventário foi limpado pela administração");
    messageSuccess(IdAdmin, `Você limpou o inventário do jogador.`);

    res.send();
  } else {
    messageFail(IdAdmin, "Jogador não encontrado");
    res.status(404).json({ error: "Jogador não encontrado" });
  }
});

module.exports = router;
