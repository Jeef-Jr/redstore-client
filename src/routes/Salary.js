const express = require("express");
const router = express.Router();
const vrp = require("../vrp");
const { sql } = require("../mysql");

function adicionarSalario(player, salary) {
  console.log(
    `Adicionando salário para o jogador ${player} no valor de ${salary}`
  );
}

function rollbackSalario(player, salary, tempo) {
  setInterval(() => {
    adicionarSalario(player, salary);
  }, tempo * 60000);
}

function gerenciarSalarios(player, gruposDoJogador) {
  for (let i = 0; i < gruposDoJogador.length; i++) {
    const grupo = gruposDoJogador[i];
    const { salary, time } = grupo;

    rollbackSalario(player, salary, time);
  }
}

const onCallbacks = async () => {
  player = 1;

  const gruposDoJogador = [
    {
      salary: 5000,
      time: 1,
      processado: 0,
    },
    {
      salary: 10000,
      time: 3,
      processado: 0,
    },
    {
      salary: 15000,
      time: 5,
      processado: 0,
    },
    {
      salary: 20000,
      time: 6,
      processado: 0,
    },
  ];

  gruposDoJogador.sort((grupoA, grupoB) => {
    const { time: timeA } = grupoA;
    const { time: timeB } = grupoB;

    return timeA - timeB;
  });

  gerenciarSalarios(player, gruposDoJogador);
};

module.exports = {
  router,
  onCallbacks,
};
