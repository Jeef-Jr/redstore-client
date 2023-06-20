const { lua } = require("./lua");
const { sql, getDatatable, setDatatable } = require("./mysql");

const vrp = {};

/**
 *
 * @returns {Promise<{name: string, firstname: string}>}
 */
vrp.isOnline = (id) => {
  return lua(`vRP.getUserSource(${id}) ~= nil`);
};

//

vrp.whiteList = vrp.bank = async (id, status) => {
  return sql("UPDATE vrp_users SET whitelisted = ? WHERE id=?", [status, id]);
};

vrp.addBank = vrp.bank = async (id, value) => {
  if (await vrp.isOnline(id)) {
    return lua(`vRP.giveBankMoney(${id}, ${value})`);
  } else {
    return sql("UPDATE vrp_user_moneys SET bank=bank+? WHERE user_id=?", [
      value,
      id,
    ]);
  }
};

vrp.removeBank = vrp.removeBank = async (id, value) => {
  if (await vrp.isOnline(id)) {
    const money = await lua(`vRP.getBankMoney(${id})`);
    if (money >= value) {
      lua(`vRP.setBankMoney(${id}, ${money - value})`);
      return true;
    } else {
      return false;
    }
  } else {
    return sql("UPDATE vrp_user_moneys SET bank=bank-? WHERE user_id=?", [
      value,
      id,
    ]);
  }
};

vrp.addInventory = vrp.addItem = async (id, item, amount) => {
  if (await vrp.isOnline(id)) {
    return lua(`vRP.giveInventoryItem(${id}, "${item}", ${amount})`);
  } else {
    const data = await getDatatable(id);
    if (data) {
      if (Array.isArray(data.inventory)) data.inventory = {};

      if (data.inventory[item] && data.inventory[item].amount) {
        data.inventory[item] = { amount: data.inventory[item].amount + amount };
      } else data.inventory[item] = { amount };
      await setDatatable(id, data);
    }
  }
};

vrp.getUsersGroupsCFG = async (id) => {
  const groups = await lua(`vRP.getUserGroups(${id})`);
  return groups;
};

vrp.addAmountItem = async (id, item, amount) => {
  await lua(`vRP.giveInventoryItem(${id}, "${item}", ${amount})`);
  return true;
};

vrp.removeAmountItem = async (id, item, amount) => {
  await lua(`vRP.tryGetInventoryItem(${id}, "${item}", ${amount})`);
  return true;
};

vrp.getId = (source) => {
  return lua(`vRP.getUserId(${source})`);
};

vrp.getSource = (id) => {
  return lua(`vRP.getUserSource(${id})`);
};

vrp.getVehicleAll = async () => {
  return lua(`vRP.vehicleGlobal()`);
};

vrp.getIsOnline = async (id) => {
  if (await vrp.isOnline(id)) {
    return true;
  }

  return false;
};

module.exports = vrp;
