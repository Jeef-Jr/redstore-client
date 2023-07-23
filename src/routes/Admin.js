const express = require("express");
const router = express.Router();
const vrp = require("../vrp");
const { sql } = require("../mysql");
const {
  tables,
  base_creative,
  notify,
  columns,
  actives,
  framework_network,
} = require("../config");
const { lua } = require("../lua");
const creative = require("../creative");

// Functions Callback

function getCoords(id, callback) {
  if (base_creative && framework_network) {
    emit("getCoords_network", id, callback);
  } else if (base_creative) {
    emit("getCoords_summerz", id, callback);
  } else {
    emit("getCoords", id, callback);
  }
}

function getInventory(id, callback) {
  if (base_creative && framework_network) {
    emit("getInventory_network", id, callback);
  } else if (base_creative) {
    emit("getInventory_summerz", id, callback);
  } else {
    emit("getInventory", id, callback);
  }
}

function getIntens(callback) {
  emit("getItens", callback);
}

function getWeaponsUser(id, callback) {
  new Promise(() => {
    emit("getWeapons", id, callback);
  });
}

function getMoneyUser(id, callback) {
  if (base_creative && framework_network) {
    emit("getMoney_network", id, callback);
  } else if (base_creative) {
    emit("getMoney_summerz", id, callback);
  } else {
    emit("getMoney", id, callback);
  }
}

function updateMoneyUser(id, wallet, bank, callback) {
  if (base_creative && framework_network) {
    emit("updadeVidaJogador_network", id, wallet, bank, callback);
  } else if (base_creative) {
    emit("updadeVidaJogador_summerz", id, wallet, bank, callback);
  } else {
    emit("updateMoney", id, wallet, bank, callback);
  }
}

function updadeVidaJogador(id, quantidade, callback) {
  if (base_creative && framework_network) {
    emit("updadeVidaJogador_network", id, quantidade, callback);
  } else if (base_creative) {
    emit("updadeVidaJogador_summerz", id, quantidade, callback);
  } else {
    emit("updadeVidaJogador", id, quantidade, callback);
  }
}

function updadeVidaJogadores(quantidade, callback) {
  if (base_creative && framework_network) {
    emit("updadeVidaJogadores_network", quantidade, callback);
  } else if (base_creative) {
    emit("updadeVidaJogadores_summerz", quantidade, callback);
  } else {
    emit("updadeVidaJogadores", quantidade, callback);
  }
}

function updateColeteJogador(id, callback) {
  if (base_creative && framework_network) {
    emit("updateColeteJogador_network", id, callback);
  } else if (base_creative) {
    emit("updateColeteJogador_summerz", id, callback);
  } else {
    emit("updateColeteJogador", id, callback);
  }
}

function tpToJogador(id, idJogador, callback) {
  if (base_creative && framework_network) {
    emit("tpToJogador_network", id, idJogador, callback);
  } else if (base_creative) {
    emit("tpToJogador_summerz", id, idJogador, callback);
  } else {
    emit("tpToJogador", id, idJogador, callback);
  }
}

function tpToMeJogador(id, idJogador, callback) {
  if (base_creative && framework_network) {
    emit("tpToMeJogador_network", id, idJogador, callback);
  } else if (base_creative) {
    emit("tpToMeJogador_summerz", id, idJogador, callback);
  } else {
    emit("tpToMeJogador", id, idJogador, callback);
  }
}

function tpToWayJogador(id, callback) {
  if (base_creative && framework_network) {
    emit("tpToWayJogador_network", id, callback);
  } else if (base_creative) {
    emit("tpToWayJogador_summerz", id, callback);
  } else {
    emit("tpToWayJogador", id, callback);
  }
}

function messageSuccess(id, message) {
  new Promise(() => {
    emit("emitirNotify", id, notify.success, message, true);
  });
}

function messageFail(id, message) {
  new Promise(() => {
    emit("emitirNotify", id, notify.negado, message, false);
  });
}

async function generateSerial() {
  const serial = await lua(`vRP.GenerateString("LDLDLDLDLD")`);

  if (actives.is_active_campo_serial_propertys) {
    const consult = await sql(`SELECT * FROM propertys WHERE Serial = ?`, [
      serial,
    ]);
    if (consult.length > 0) {
      generateSerial();
    } else {
      return serial;
    }
  }
}

// Routers

router.post("/whitelist", async (req, res) => {
  const { id, status } = req.body;

  if (id > 0 || id !== "") {
    base_creative
      ? await creative.whiteList(id, status)
      : await vrp.whiteList(id, status);

    res.json({
      info: true,
    });
  } else {
    res.json({
      info: false,
    });
  }
});

router.post("/placa", async (req, res) => {
  const { id, placa } = req.body;

  new Promise(() => {
    if (base_creative && framework_network) {
    } else if (base_creative) {
      emit("trocarPlacaVeh_summerz", id, placa);
    } else {
      emit("trocarPlacaVeh", id, placa);
    }
  });
  res.json({ message: "modifyPlaca." });
});

router.post("/inventory", async (req, res) => {
  const { id, item, quantidades } = req.body;

  if (quantidades > 0) {
    base_creative
      ? await creative.addAmountItem(id, item, quantidades)
      : await vrp.addInventory(id, item, quantidades);

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
    base_creative
      ? await creative.bank(id, value)
      : await vrp.addBank(id, value);

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

router.post("/removeBanco", async (req, res) => {
  const { id, value } = req.body;

  if (value > 0) {
    const response = base_creative
      ? await creative.removeBank(id, value)
      : await vrp.removeBank(id, value);

    if (response) {
      messageFail(
        id,
        `Administração removeu <b>R$ ${value} </b> da sua conta.`
      );
      res.json({
        info: true,
      });
    } else {
      res.json({
        info: false,
      });
    }
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
    if (base_creative && framework_network) {
      emit("spawnCar_network", id, vehicle);
    } else if (base_creative) {
      emit("spawnCar_summerz", id, vehicle);
    } else {
      emit("spawnCar", id, vehicle);
    }
  });

  res.json({
    message: "vehicle generated successfully",
  });
});

router.post("/addCar", async (req, res) => {
  const { idRecebidor, vehicle } = req.body;

  const dados = await sql(
    `SELECT * FROM ${tables.vehicles} AS VH WHERE ${
      base_creative
        ? `VH.${columns.campo_identificador_vehicles}`
        : "VH.user_id"
    } = ${idRecebidor} AND VH.vehicle = '${vehicle}'`
  );

  if (dados.length > 0) {
    res.json({
      info: false,
      message: "O Usuário já possui este veículo.",
    });
    return;
  }

  await sql(
    `INSERT INTO ${tables.vehicles} ${
      !base_creative
        ? "(user_id, vehicle, ipva)"
        : `(${columns.campo_identificador_vehicles}, vehicle, tax, plate, work)`
    } VALUES ${
      base_creative
        ? `(${idRecebidor}, '${vehicle}', 1689186484, '${await lua(
            `vRP.GeneratePlate()`
          )}', 'false')`
        : `(${idRecebidor}, '${vehicle}', NOW())`
    }`
  );

  messageSuccess(
    idRecebidor,
    "Parabêns, você foi presentiado com um veículo, confira sua garagem."
  );

  res.json({
    info: true,
  });
});

router.get("/coords/:id", async (req, res) => {
  const { id } = req.params;

  let isOnline = false;

  if (base_creative) {
    isOnline = await creative.isOnline(id);
  } else {
    isOnline = await vrp.getIsOnline(id);
  }

  if (isOnline) {
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

router.get("/coords", async (req, res) => {
  const dados = await sql(`SELECT * FROM redstore_coords`);

  res.json(dados);
});

router.post("/coords", async (req, res) => {
  const { tipo, name, x, y, z, icon } = req.body;

  if (tipo === 0) {
    await sql(
      `INSERT INTO redstore_coords (tipo, name, x, y, z) VALUES (?, ?, ?, ?, ?)`,
      [tipo, name, x, y, z]
    );

    res.json({ info: true });
  } else {
    await sql(
      `INSERT INTO redstore_coords (tipo, name, x, y, z, icon) VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo, name, x, y, z, icon]
    );

    const coords = await sql(
      `SELECT * FROM redstore_coords WHERE name=? AND x=? AND y=? AND z=?`,
      [name, x, y, z]
    );

    emit("listBlipMarks", coords);

    res.json({ info: true });
  }
});

router.delete("/coords/:id", async (req, res) => {
  const { id } = req.params;

  const blip = await sql(`SELECT * FROM redstore_coords WHERE id=?`, [id]);

  await sql(`DELETE FROM redstore_coords WHERE id=?`, [id]);

  emit("removeBlipMark", {
    x: parseFloat(blip[0].x),
    y: parseFloat(blip[0].y),
    z: parseFloat(blip[0].z),
  });

  res.json({ info: true });
});

router.post("/teleportar", async (req, res) => {
  const { id, x, y, z } = req.body;

  if (base_creative && framework_network) {
    emit("teleportar_network", id, {
      x: parseFloat(x),
      y: parseFloat(y),
      z: parseFloat(z),
    });
  } else if (base_creative) {
    emit("teleportar_summerz", id, {
      x: parseFloat(x),
      y: parseFloat(y),
      z: parseFloat(z),
    });
  } else {
    emit("teleportar", id, {
      x: parseFloat(x),
      y: parseFloat(y),
      z: parseFloat(z),
    });
  }

  res.json({ info: true });
});

router.delete("/limpartInvUser/:idUser", (req, res) => {
  const { idUser } = req.params;

  const player = base_creative
    ? creative.getPassaport(idUser)
    : vrp.getId(idUser);

  if (player) {
    new Promise(() => {
      if (base_creative && framework_network) {
        emit("limparInv_network", idUser);
      } else if (base_creative) {
        emit("limparInv_summerz", idUser);
      } else {
        emit("limparInv", idUser);
      }
    });

    messageSuccess(idUser, "Seu inventário foi limpado pela administração");

    res.json({ info: true });
  } else {
    res.json({ info: false });
  }
});

router.delete("/limparArmas/:idUser", (req, res) => {
  const { idUser } = req.params;

  const player = vrp.getSource(idUser);

  if (player) {
    new Promise(() => {
      emit("limparArmas", idUser, player);
    });

    messageSuccess(idUser, "Seu armamento foi retirado pela administração");

    res.json({ info: true });
  } else {
    res.json({ info: false });
  }
});

router.get("/jogadores", async (req, res) => {
  const dados = await sql(
    base_creative
      ? `SELECT * FROM ${
          framework_network ? tables.accounts : tables.characters
        }`
      : `SELECT * FROM vrp_users`
  );

  let usersInformations = [];

  for (const users of dados) {
    const id = users.id;

    const identities = await sql(
      base_creative
        ? `SELECT * FROM ${tables.characters} WHERE ${columns.campo_identificador_characters}=?`
        : `SELECT * FROM vrp_user_identities WHERE user_id=?`,
      [id]
    );

    const money = !base_creative
      ? await sql(`SELECT * FROM vrp_user_moneys WHERE user_id=?`, [id])
      : framework_network
      ? await sql(
          `SELECT ${columns.campo_bank} as 'bank' from ${tables.bank} WHERE ${columns.campo_identificador_bank} =?`,
          [id]
        )
      : identities.bank;

    const vehicles = await sql(
      `SELECT * FROM ${tables.vehicles} WHERE ${
        base_creative ? columns.campo_identificador_vehicles : "user_id"
      } =?`,
      [id]
    );

    const homes = await sql(
      base_creative
        ? `SELECT * FROM ${tables.priority} AS P WHERE P.${columns.campo_identificador_properties} = ?`
        : `SELECT * FROM ${tables.priority} AS VPH WHERE VPH.user_id = ? AND VPH.owner = 1`,
      [id]
    );

    let inventory = [];

    getInventory(id, (callback) => {
      inventory.push(callback);
    });

    const isOnline = base_creative
      ? await creative.isOnline(id)
      : await vrp.getIsOnline(id);

    usersInformations.push({
      users: users,
      playerOnline: isOnline,
      identities: identities.length > 0 ? identities[0] : [],
      money: base_creative ? identities.bank : money.length > 0 ? money[0] : [],
      vehicles: vehicles ?? [],
      homes: homes ?? [],
      inventory: inventory ?? [],
    });
  }

  res.json({ usersInformations });
});

router.post("/item/add", async (req, res) => {
  const { id, item, amount } = req.body;

  const response = base_creative
    ? await creative.addAmountItem(id, item, amount)
    : await vrp.addAmountItem(id, item, amount);

  if (response) {
    messageSuccess(
      id,
      `Administração adicionou <b> x${amount} ${item} </b> no seu inventário.`
    );

    res.json({ info: true });
    return;
  }

  res.json({ info: false });
});

router.post("/item/remove", async (req, res) => {
  const { id, item, amount } = req.body;

  const response = base_creative
    ? await creative.removeAmountItem(id, item, amount)
    : await vrp.removeAmountItem(id, item, amount);

  if (response) {
    messageFail(
      id,
      `Administração removeu <b> x${amount} ${item} </b> do seu inventário.`
    );

    res.json({ info: true });
    return;
  }

  res.json({ info: false });
});

router.post("/group/criar", async (req, res) => {
  const { group } = req.body;

  const response = await sql(
    `SELECT nome FROM redstore_groups WHERE nome=?`,
    group
  );

  if (response.length > 0) {
    return res.json({ info: false, message: "Esse grupo já existe." });
  }

  await sql(`INSERT INTO redstore_groups (nome) VALUES (?)`, group);

  res.json({ info: true });
});

router.put("/group/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  await sql(`UPDATE redstore_groups SET nome=? WHERE id=?`, [nome, id]);

  res.json({ info: true });
});

router.delete("/group/:id", async (req, res) => {
  const { id } = req.params;

  await sql(`DELETE FROM redstore_groups WHERE id=?`, [id]);

  res.json({ info: true });
});

router.post("/group/hierarquia/criar", async (req, res) => {
  const { id_group, cargo, salario, time } = req.body;

  const response = await sql(
    `SELECT * FROM redstore_groups_hierarquia WHERE id_group=?`,
    [id_group]
  );

  for (const cargo of response) {
    if (cargo.nome === cargo) {
      return res.json({ info: false, message: "Esse cargo já existe." });
    }
  }
  await sql(
    `INSERT INTO redstore_groups_hierarquia (id_group, hierarquia, nome, salary, time) 
    VALUES (?,?,?,?,?)`,
    [id_group, response.length + 1, cargo, salario, time]
  );

  res.json({ info: true });
});

router.put("/group/hierarquia/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { cargo, salario, time } = req.body;

  await sql(
    `UPDATE redstore_groups_hierarquia SET nome=?, salary=?, time=? WHERE id=?`,
    [cargo, salario, time, id]
  );

  res.json({ info: true });
});

router.delete("/group/hierarquia/:id", async (req, res) => {
  const { id } = req.params;

  await sql(`DELETE FROM redstore_groups_hierarquia WHERE id=?`, [id]);

  res.json({ info: true });
});

router.put("/group/:id", async (req, res) => {
  const { id } = req.params;
  const { group } = req.body;

  await sql(`UPDATE redstore_groups SET nome=? WHERE id=?`, [group, id]);

  res.json({ info: true });
});

router.get("/getGroups", async (req, res) => {
  const groups = await sql(`SELECT * FROM redstore_groups`);

  let arrayGroupsAll = [];

  for (const group of groups) {
    const hierarquia = await sql(
      `SELECT * FROM redstore_groups_hierarquia WHERE id_group=?`,
      [group.id]
    );

    arrayGroupsAll.push({ group: group, hierarquia });
  }

  res.json(arrayGroupsAll);
});

router.get("/getGroups/:id", async (req, res) => {
  const { id } = req.params;

  const groups = await sql(
    `
  SELECT *, RH.nome as "nome_hierarquia" FROM redstore_groups_user AS RU 
  INNER JOIN redstore_groups_hierarquia AS RH 
  INNER JOIN redstore_groups AS RG ON RU.idHierarquia = RH.id AND RH.id_group = RG.id WHERE RU.idUser=?`,
    [id]
  );

  let arryMyGroups = [];

  for (let index = 0; index < groups.length; index++) {
    const dados = groups[index];
    const idHierarquia = dados.idHierarquia;

    const history = await sql(
      `SELECT * FROM redstore_history_pagament WHERE idUser=? AND idHierarquia=?`,
      [id, idHierarquia]
    );

    arryMyGroups.push({ dados, history: history ?? [] });
  }

  res.json(arryMyGroups);
});

router.post("/groupAdd", async (req, res) => {
  const { id, hierarquia } = req.body;

  const response = await sql(
    "SELECT * FROM redstore_groups_user WHERE idUser=? AND idHierarquia=?",
    [id, hierarquia]
  );

  if (!(response.length > 0)) {
    await sql(
      `INSERT INTO redstore_groups_user (idUser, idHierarquia) VALUES(?,?)`,
      [id, hierarquia]
    );

    const dados = await sql(
      `
    SELECT RG.nome, RH.salary, RH.time FROM redstore_groups_hierarquia AS RH INNER 
    JOIN redstore_groups AS RG ON RH.id_group = RG.id WHERE RH.id=?`,
      [hierarquia]
    );

    messageSuccess(
      id,
      `Administração te colocou de: <b> ${hierarquia} no grupo (${dados[0].nome}) </b>`
    );
    emit("addNovoSalary", id, hierarquia, dados[0].salary, dados[0].time);

    res.json({ info: true });
    return;
  }
  res.json({ info: false, message: "O usuário já possui este grupo!" });
});

router.post("/groupRemove", async (req, res) => {
  const { id, hierarquia } = req.body;

  await sql(
    `DELETE FROM redstore_groups_user WHERE idUser=? AND idHierarquia=?`,
    [id, hierarquia]
  );

  const nomeGroup = await sql(
    `
  SELECT RG.nome FROM redstore_groups_hierarquia AS RH INNER 
  JOIN redstore_groups AS RG ON RH.id_group = RG.id WHERE RH.id=?`,
    [hierarquia]
  );

  messageFail(id, `Administração te removeu no grupo: <b> ${nomeGroup} </b>`);

  res.json({ info: true });
});

router.get("/getItens", (req, res) => {
  getIntens((itens) => {
    res.json(itens);
  });
});

router.get("/inventory/user/:id", async (req, res) => {
  const { id } = req.params;

  let inventory = [];

  getInventory(id, (callback) => {
    inventory.push(callback);
  });

  res.json({ inventory: inventory ?? [] });
});

router.get("/vehiclesAll", async (req, res) => {
  const vehicles = base_creative
    ? await creative.getVehicleAll()
    : await vrp.getVehicleAll();

  res.json(vehicles);
});

router.get("/vehiclesUser/:id", async (req, res) => {
  const { id } = req.params;

  const vehicles = await sql(
    `SELECT * FROM ${tables.vehicles} WHERE ${
      base_creative ? columns.campo_identificador_vehicles : "user_id"
    } =?`,
    [id]
  );

  res.json(vehicles);
});

router.post("/vehicleUserRemove", async (req, res) => {
  const { id, vehicle } = req.body;

  await sql(
    `DELETE FROM ${tables.vehicles} WHERE ${
      base_creative ? columns.campo_identificador_vehicles : "user_id"
    } = ? AND vehicle = ? `,
    [id, vehicle]
  );

  messageSuccess(
    id,
    `Administração removeu o veículo <b/> ${vehicle} </b> da sua garagem.`
  );

  res.json({ info: true });
});

router.get("/getWeapons/:id", async (req, res) => {
  const { id } = req.params;

  getWeaponsUser(id, (callback) => {
    res.json(callback);
  });
});

router.get("/homesAll", async (req, res) => {
  if (base_creative) {
    const response =
      await sql(`SELECT RH.*, CHP.${columns.campo_properties_name} AS 'home_use'
    FROM redstore_homes RH
    LEFT JOIN ${tables.priority} CHP ON RH.home = CHP.${columns.campo_properties_name}`);
    res.json(response);
  } else {
    const response = await sql(`SELECT RH.*, VHP.home AS 'home_use'
    FROM redstore_homes RH
    LEFT JOIN ${tables.priority} VHP ON RH.home = VHP.home`);

    res.json(response);
  }
});

router.get("/homesUser/:id", async (req, res) => {
  const { id } = req.params;

  const response = await sql(
    `SELECT * FROM ${tables.priority} WHERE ${
      base_creative ? columns.campo_identificador_properties : "user_id"
    } = ?`,
    [id]
  );

  res.json(response);
});

router.get("/interiores", async (req, res) => {
  const interiores = await sql(`SELECT * FROM redstore_homes_interior`);

  res.json(interiores);
});

router.post("/homeAdd", async (req, res) => {
  const { id, home, interior } = req.body;
  if (base_creative) {
    const serial = await generateSerial();
    if (actives.is_active_campo_serial_propertys) {
      await creative.addAmountItem(id, `propertys-${serial}`, 3);
    }

    const information = await sql(
      `SELECT * FROM redstore_homes_interior WHERE name = ?`,
      [interior]
    );

    if (base_creative && framework_network) {
      await sql(
        `INSERT INTO ${tables.priority} (Name, Interior, Tax, Passport, Serial, Vault, Fridge) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          home.toString(),
          interior.toString(),
          1691525913,
          parseInt(id),
          actives.is_active_campo_serial_propertys && serial.toString(),
          parseInt(information[0].vault),
          parseInt(information[0].fridge),
        ]
      );
    } else {
      await sql(
        `INSERT INTO ${tables.priority} (name, interior, tax, user_id, vault, fridge, owner) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          home.toString(),
          interior.toString(),
          1691525913,
          parseInt(id),
          parseInt(information[0].vault),
          parseInt(information[0].fridge),
          1,
        ]
      );
    }
  } else {
    await sql(
      `INSERT INTO ${tables.priority} (home, user_id, owner, tax, garage) VALUES (?, ?, ?, ?, ?)`,
      [home, id, 1, 1686884705, 1]
    );
  }

  messageSuccess(
    id,
    `Administração adicionou uma nova casa para você : <b>${home}</b>`
  );

  res.json({
    info: true,
  });
});

router.post("/homeRemove", async (req, res) => {
  const { id, home } = req.body;

  await sql(
    `DELETE FROM ${tables.priority} WHERE ${columns.campo_properties_name}=? AND ${columns.campo_identificador_properties}=?`,
    [home, id]
  );

  messageFail(id, `Administração removeu uma casa de você : <b>${home}</b>`);

  res.json({
    info: true,
  });
});

router.put("/updateIdentities", async (req, res) => {
  const { id, registration, phone, sobrenome, nome, idade } = req.body;

  if (base_creative) {
    framework_network
      ? await sql(
          `UPDATE ${tables.characters} SET phone = ?, name = ?, name2 = ?, age = ? WHERE ${columns.campo_identificador_characters} = ? `,
          [phone, nome, sobrenome, idade, id]
        )
      : await sql(
          `UPDATE ${tables.characters} SET phone = ?, name = ?, name2 = ? WHERE ${columns.campo_identificador_characters} = ?`,
          [phone, nome, sobrenome, id]
        );
  } else {
    await sql(
      `UPDATE vrp_user_identities SET registration = ?, phone = ?, firstname = ?, name = ?, age = ? WHERE user_id = ?
      `,
      [registration, phone, sobrenome, nome, idade, id]
    );
  }

  messageSuccess(id, `Administração atualizou sua identidade.`);

  res.json({
    info: true,
  });
});

router.get("/identities/:id", async (req, res) => {
  const { id } = req.params;

  const identities = await sql(
    `SELECT * FROM ${
      base_creative ? tables.characters : "vrp_user_identities"
    } WHERE ${
      base_creative ? columns.campo_identificador_characters : "user_id"
    }=?`,
    [id]
  );

  res.json(...identities);
});

router.get("/getMoney/:id", async (req, res) => {
  const { id } = req.params;

  if (await vrp.isOnline(id)) {
    getMoneyUser(id, (callback) => {
      res.json(callback);
    });
  } else {
    const money = await sql(
      `SELECT * FROM ${
        base_creative ? tables.characters : "vrp_user_moneys"
      } WHERE ${
        base_creative ? columns.campo_identificador_characters : "user_id"
      }=?`,
      [id]
    );

    res.json(...money);
  }
});

router.put("/updateMoney/:id", async (req, res) => {
  const { id } = req.params;
  const { wallet, bank } = req.body;

  if (base_creative ? await creative.isOnline(id) : await vrp.isOnline(id)) {
    if (base_creative) {
      await creative.setValor(id, bank);

      res.json({ info: true });
    } else {
      updateMoneyUser(id, wallet, bank, (callback) => {
        if (callback) {
          messageSuccess(
            id,
            `Administração setou seu dinheiro: <b>R$ ${wallet}</b>, Banco : <b> R$ ${bank} </b>`
          );

          res.json({ info: true });
        }
      });
    }
  } else {
    if (base_creative) {
      await sql(
        `UPDATE ${tables.bank} SET ${columns.campo_bank} = ? WHERE ${columns.campo_identificador_characters} = ?
      `,
        [bank, id]
      );
    } else {
      await sql(
        `UPDATE vrp_user_moneys SET wallet = ?, bank = ? WHERE user_id = ?
      `,
        [wallet, bank, id]
      );
    }

    res.json({ info: true });
  }
});

router.post("/vidaPlayer", async (req, res) => {
  const { id, quantidade } = req.body;
  if (base_creative ? await creative.isOnline(id) : await vrp.isOnline(id)) {
    updadeVidaJogador(id, quantidade, (callback) => {
      if (callback) {
        res.json({
          info: true,
        });
        messageSuccess(id, "Administração te gerou uma quantidade de vida.");
      } else {
        res.json({
          info: false,
        });
      }
    });
  } else {
    res.json({
      info: false,
    });
  }
});

router.post("/vidaPlayers", async (req, res) => {
  const { quantidade } = req.body;

  updadeVidaJogadores(quantidade, (callback) => {
    if (callback) {
      res.json({
        info: true,
      });
    } else {
      res.json({
        info: false,
      });
    }
  });
});

router.post("/coletePlayer", async (req, res) => {
  const { id } = req.body;

  if (base_creative ? await creative.isOnline(id) : await vrp.isOnline(id)) {
    updateColeteJogador(parseInt(id), (callback) => {
      if (callback) {
        res.json({
          info: true,
        });
        messageSuccess(id, "Administração te gerou um colete.");
      } else {
        res.json({
          info: false,
        });
      }
    });
  } else {
    res.json({
      info: false,
    });
  }
});

router.post("/tpToJogador", async (req, res) => {
  const { myId, idJogador } = req.body;

  if (
    base_creative
      ? await creative.isOnline(idJogador)
      : await vrp.isOnline(idJogador)
  ) {
    tpToJogador(parseInt(myId), parseInt(idJogador), (callback) => {
      if (callback) {
        res.json({
          info: true,
        });
      } else {
        res.json({
          info: false,
        });
      }
    });
  } else {
    res.json({
      info: false,
    });
  }
});

router.post("/tpToMeJogador", async (req, res) => {
  const { myId, idJogador } = req.body;

  if (
    base_creative
      ? await creative.isOnline(idJogador)
      : await vrp.isOnline(idJogador)
  ) {
    tpToMeJogador(parseInt(myId), parseInt(idJogador), (callback) => {
      if (callback) {
        messageSuccess(idJogador, "Administração realizou o teletransporte.");
        res.json({
          info: true,
        });
      } else {
        res.json({
          info: false,
        });
      }
    });
  } else {
    res.json({
      info: false,
    });
  }
});

router.post("/tpToWayJogador", async (req, res) => {
  const { id } = req.body;

  if (base_creative ? await creative.isOnline(id) : await vrp.isOnline(id)) {
    tpToWayJogador(parseInt(id), (callback) => {
      if (callback) {
        messageSuccess(id, "Administração realizou o teletransporte.");
        res.json({
          info: true,
        });
      } else {
        res.json({
          info: false,
        });
      }
    });
  } else {
    res.json({
      info: false,
    });
  }
});

module.exports = router;
