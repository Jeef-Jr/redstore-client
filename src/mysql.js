const mysql = require("mysql2");
const config = require("../config.json");
const { addWebhookBatch } = require("./api");
const utils = require("./utils");

let connection = undefined;

module.exports.ping = (cb) => {
  if (connection) connection.ping(cb);
};

module.exports.connect = () =>
  new Promise((resolve) => {
    try {
      connection = mysql.createConnection(config.mysql);
      connection.connect((err) => resolve(err));
    } catch (error) {
      resolve(error);
    }
  });

module.exports.isConnected = () =>
  connection && connection.state == "connected";

const sql = (sql, args = [], ignore = false) =>
  new Promise((resolve, reject) => {
    if (!ignore)
      addWebhookBatch(`\`\`\`sql\n${sql}\n/* [${args.join(",")}] */\`\`\``);
    connection.query(sql, args, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

module.exports.getDatatable = async (id) => {
  const [row] = await sql(
    "SELECT dvalue FROM vrp_user_data WHERE user_id=? AND (dkey='vRP:datatable' OR dkey='Datatable')",
    [id],
    true
  );
  return row ? JSON.parse(row.dvalue) : null;
};

module.exports.setDatatable = (id, value) => {
  return sql(`UPDATE vrp_user_data SET dvalue=? WHERE user_id=? AND (dkey='vRP:datatable' OR dkey='Datatable')`, [JSON.stringify(value), id], true);
}

module.exports.sql = sql;
