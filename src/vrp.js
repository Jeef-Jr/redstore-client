const { lua } = require("./lua");
const api = require("./api");
const {
  sql,
  pluck,
  insert,
  getDatatable,
  setDatatable,
  createAppointment,
  after,
} = require("./mysql");
const { snowflake, hasPlugin } = require("./config");
const Warning = require("./Warning");
const { firstAvailableNumber } = require("./utils");
const config = require("./config");

const vrp = {};

function now() {
  return parseInt(Date.now() / 1000);
}

/**
 *
 * @returns {Promise<{name: string, firstname: string}>}
 */
vrp.isOnline = (id) => {
  return lua(`vRP.getUserSource(${id}) ~= nil`);
};

//

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

vrp.getId = (source) => {
 return lua(`vRP.getUserId(${source})`);
};

vrp.getSource = (id) => {
  return lua(`vRP.getUserSource(${id})`);
};


module.exports = vrp;
