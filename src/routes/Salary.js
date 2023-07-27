const express = require("express");
const router = express.Router();
const vrp = require("../vrp");
const { sql } = require("../mysql");
const { base_creative, framework_network, notify } = require("../config");
const creative = require("../creative");
const { lua } = require("../lua");

function messageSuccess(id, message) {
  if (base_creative && framework_network) {
    emit(
      "emitirNotifyNetwork",
      id,
      notify.success,
      message,
      true,
      notify.use_source,
      notify.time
    );
  } else if (base_creative) {
    emit(
      "emitirNotifySummerz",
      id,
      notify.success,
      message,
      true,
      notify.use_source,
      notify.time
    );
  } else {
    emit(
      "emitirNotify",
      id,
      notify.success,
      message,
      true,
      notify.use_source,
      notify.time
    );
  }
}

function adicionarSalario(player, salary) {
  if (base_creative) {
    creative.addBank(player, salary);
  } else {
    vrp.addBank(player, salary);
  }

  messageSuccess(player, `Você recebeu seu pagamento de <b>$ ${salary} <b/>`);
}

async function addHistory(player, idhierarquia) {
  await sql(
    `INSERT INTO redstore_history_pagament (idUser, idHierarquia, data) VALUES (?,?,NOW())`,
    [player, idhierarquia]
  );
}

async function verificarPreco(player, id) {
  const response = await sql(
    `SELECT RGH.id, RGH.salary, RGH.time FROM redstore_groups_hierarquia AS RGH JOIN redstore_groups_user AS RG ON RGH.id = RG.idHierarquia WHERE RG.idUser = ? AND RGH.id = ?`,
    [player, id]
  );

  rollbackSalario(player, response[0].id, response[0].salary, response[0].time);
}

function rollbackSalario(player, id, salary, tempo) {
  setTimeout(() => {
    adicionarSalario(player, salary);
    addHistory(player, id);
    verificarPreco(player, id);
  }, tempo * 60000);
}

function gerenciarSalarios(player, gruposDoJogador) {
  for (let i = 0; i < gruposDoJogador.length; i++) {
    const grupo = gruposDoJogador[i];
    const { id, salary, time } = grupo;

    rollbackSalario(player, id, salary, time);
  }
}

const onCallbackJogadores = async () => {
  const jogadores = [
    base_creative && framework_network
      ? await lua(`vRP.Players()`)
      : base_creative
      ? await lua(`vRP.userList()`)
      : await lua(`vRP.getUsers()`),
  ];

  console.log(jogadores.length);

  for (let i = 0; i < jogadores.length; i++) {
    const id = !framework_network ? Object.entries(jogadores[i]).map(([name]) => {
      return name;
    }) : jogadores[i]

    console.log(jogadores[i]);
    onCallbacks(parseInt(id));
  }
};

const onCallbacks = async (idUser) => {

  console.log("Jogador Online", idUser);

  const gruposDoJogador = await sql(
    `SELECT RGH.id, RGH.salary, RGH.time FROM redstore_groups_hierarquia AS RGH JOIN redstore_groups_user AS RG ON RGH.id = RG.idHierarquia WHERE RG.idUser = ?`,
    [idUser]
  );

  gruposDoJogador.sort((grupoA, grupoB) => {
    const { time: timeA } = grupoA;
    const { time: timeB } = grupoB;

    return timeA - timeB;
  });

  gerenciarSalarios(idUser, gruposDoJogador);
};

onNet("playerFirstSpawn", (idUser) => {
  onCallbacks(idUser);
});

onNet("addNovoSalary", (player, id, salary, tempo) => {
  rollbackSalario(player, id, salary, tempo);
});

module.exports = {
  router,
  onCallbackJogadores,
};
