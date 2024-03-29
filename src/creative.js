const { lua } = require("./lua");
const { sql, getDatatable, setDatatable } = require("./mysql");

const { columns, tables, framework_network } = require("../config.json");

const creative = {};

creative.isOnline = async (id) => {
  if (framework_network) {
    return await lua(`vRP.Source(${id}) ~= nil`);
  } else {
    return await lua(`vRP.userSource(${id}) ~= nil`);
  }
};

creative.getPassaport = async (source) => {
  return await lua(`vRP.Passaport(${source})`);
};

creative.whiteList = creative.whiteList = async (id, status) => {
  return sql(
    `UPDATE ${tables.accounts} SET whitelist = ? WHERE ${columns.campo_identificador_accounts}=?`,
    [status, id]
  );
};

creative.getBank = creative.getBank = async (id) => {
  if (await creative.isOnline(id)) {
    if (framework_network) {
      const sourceUser = await lua(`vRP.Source(${id})`);
      return await lua(`vRP.GetBank(${sourceUser})`);
    } else {
      const sourceUser = await lua(`vRP.Source(${id})`);
      return await lua(`vRP.GetBank(${sourceUser})`);
    }
  }
};

creative.addBank = creative.addBank = async (id, value) => {
  if (await creative.isOnline(id)) {
    if (framework_network) {
      return lua(`vRP.GiveBank(${id}, ${value})`);
    } else {
      return lua(` vRP.addBank(${id}, ${value}, "Private")`);
    }
  } else {
    return sql(
      `UPDATE ${tables.bank} SET ${columns.campo_bank}=${columns.campo_bank}+? WHERE ${columns.campo_identificador_bank}=?`,
      [value, id]
    );
  }
};

creative.setValor = creative.setValor = async (id, value) => {
  if (await creative.isOnline(id)) {
    if (framework_network) {
      return lua(`vRP.setNovoValor(${parseInt(id)}, ${parseInt(value)})`);
    } else {
      return lua(` vRP.addBank(${id}, ${value}, "Private")`);
    }
  } else {
    return sql(
      `UPDATE ${tables.bank} SET ${columns.campo_bank}=${columns.campo_bank}+? WHERE ${columns.campo_identificador_bank}=?`,
      [value, id]
    );
  }
};

creative.addBank = creative.addBank = async (id, value) => {
  if (await creative.isOnline(id)) {
    if (framework_network) {
      return lua(`vRP.GiveBank(${id}, ${value})`);
    } else {
      return lua(` vRP.addBank(${id}, ${value}, "Private")`);
    }
  } else {
    return sql(
      `UPDATE ${tables.bank} SET ${columns.campo_bank}=${columns.campo_bank}+? WHERE ${columns.campo_identificador_bank}=?`,
      [value, id]
    );
  }
};

creative.removeBank = creative.removeBank = async (id, value) => {
  if (await creative.isOnline(id)) {
    const money = framework_network
      ? await lua(`vRP.GetBank(${id})`)
      : await lua(`vRP.userBank(${id}, "Private")`);

    if (money >= value) {
      if (framework_network) {
        lua(`vRP.RemoveBank(${id}, ${value})`);
        return true;
      } else {
        lua(`vRP.delBank(${id}, ${value}, "Private")`);
        return true;
      }
    } else {
      return false;
    }
  } else {
    return sql("UPDATE characters SET bank=bank-? WHERE id=?", [value, id]);
  }
};

creative.removeAmountItem = async (id, item, amount) => {
  framework_network
    ? await lua(`vRP.RemoveItem(${id}, "${item}", ${amount}, true)`)
    : await lua(`vRP.removeInventoryItem(${id}, "${item}", ${amount}, true)`);
  return true;
};

creative.addAmountItem = async (id, item, amount) => {
  const inventory = framework_network
    ? await lua(`vRP.Inventory(${id})`)
    : await lua(`vRP.userInventory(${id})`);

  if (Object.keys(inventory).length > 0) {
    const inventoryItems = Object.values(inventory);

    for (let index = 0; index < inventoryItems.length; index++) {
      const dadosItem = inventoryItems[index];

      if (dadosItem.item === item) {
        framework_network
          ? await lua(
              `vRP.GiveItem(${parseInt(id)}, "${item}", ${parseInt(
                amount
              )}, true, ${index + 1})`
            )
          : await lua(
              `vRP.giveInventoryItem(${parseInt(id)}, "${item}", ${parseInt(
                amount
              )}, true, ${index + 1})`
            );
        return true;
      }
    }

    framework_network
      ? await lua(
          `vRP.GiveItem(${parseInt(id)}, "${item}", ${parseInt(amount)}, true)`
        )
      : await lua(
          `vRP.giveInventoryItem(${parseInt(id)}, "${item}", ${parseInt(
            amount
          )}, true)`
        );
    return true;
  }
  framework_network
    ? await lua(
        `vRP.GiveItem(${parseInt(id)}, "${item}", ${parseInt(amount)}, true)`
      )
    : await lua(
        `vRP.giveInventoryItem(${parseInt(id)}, "${item}", ${parseInt(
          amount
        )}, true)`
      );
  return true;
};

creative.getVehicleAll = async () => {
  return await lua(`vRP.vehicleListRedStore()`);
};

onNet("refreshBlip", async (user) => {
  const source = await lua(`vRP.Source(${user})`)
  const coords = await sql(`SELECT * FROM redstore_coords`);

  emit("listBlipMarksNetwork", source, coords);
});

module.exports = creative;
