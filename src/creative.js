const { lua } = require("./lua");
const { sql, getDatatable, setDatatable } = require("./mysql");

const creative = {};

creative.isOnline = async (id) => {
  return await lua(`vRP.Source(${id}) ~= nil`);
};

creative.getPassaport = async (source) => {
  return await lua(`vRP.Passaport(${source})`);
};

creative.whiteList = creative.whiteList = async (id, status) => {
  return sql("UPDATE accounts SET whitelist = ? WHERE id=?", [status, id]);
};

creative.addBank = creative.bank = async (id, value) => {
  if (await creative.isOnline(id)) {
    return lua(`vRP.GiveBank(${id}, ${value})`);
  } else {
    return sql("UPDATE characters SET bank=bank+? WHERE id=?", [value, id]);
  }
};

creative.removeBank = creative.removeBank = async (id, value) => {
  if (await creative.isOnline(id)) {
    const money = await lua(`vRP.GetBank(${id})`);

    if (money >= value) {
      lua(`vRP.RemoveBank(${id}, ${value})`);
      return true;
    } else {
      return false;
    }
  } else {
    return sql("UPDATE characters SET bank=bank-? WHERE id=?", [value, id]);
  }
};

creative.removeAmountItem = async (id, item, amount) => {
  await lua(`vRP.RemoveItem(${id}, "${item}", ${amount}, true)`);
  return true;
};

creative.addInventory = creative.addInventory = async (id, item, amount) => {
  // if (await creative.isOnline(id)) {
  //   const user_id = await creative.getPassaport(id);
  //   console.log("entrou");
  //   return lua(`vRP.GenerateItem(${user_id}, "${item}", ${amount}, true)`);
  // } else {
  //   const data = await getDatatable(id);
  //   if (data) {
  //     if (Array.isArray(data.inventory)) data.inventory = {};
  //     if (data.inventory[item] && data.inventory[item].amount) {
  //       data.inventory[item] = { amount: data.inventory[item].amount + amount };
  //     } else data.inventory[item] = { amount };
  //     await setDatatable(id, data);
  //   }
  // }
};

creative.addAmountItem = async (id, item, amount) => {
  const inventory = await lua(`vRP.Inventory(${id})`);

  if (Object.keys(inventory).length > 0) {
    const inventoryItems = Object.values(inventory);

    for (let index = 0; index < inventoryItems.length; index++) {
      const dadosItem = inventoryItems[index];

      if (dadosItem.item === item) {
        await lua(
          `vRP.GiveItem(${parseInt(id)}, "${item}", ${parseInt(
            amount
          )}, true, ${index + 1})`
        );
        return true;
      }
    }

    await lua(
      `vRP.GiveItem(${parseInt(id)}, "${item}", ${parseInt(amount)}, true)`
    );
    return true;
  }
  await lua(
    `vRP.GiveItem(${parseInt(id)}, "${item}", ${parseInt(amount)}, true)`
  );
  return true;
};

creative.getVehicleAll = async () => {
  return await lua(`vRP.vehicleListRedStore()`);
};

creative.addGroup = async (id, group, hierarquia) => {
  return await lua(`vRP.SetPermission(${id}, '${group}', ${hierarquia})`);
};

creative.getGroups = async (id) => {
  const groups = await sql(`SELECT * FROM entitydata`);

  const groupUser = [];

  for (const group of groups) {
    const dvalue = JSON.parse(group.dvalue);

    for (const key in dvalue) {
      if (key === id.toString()) {
        groupUser.push(group);
      }
    }
  }

  return groupUser;
};

creative.removeGroup = async (id, permission) => {
  await lua(`vRP.RemovePermission(${id}, '${permission}')`);

  return true;
};

module.exports = creative;
