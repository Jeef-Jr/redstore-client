const axios = require("axios").default;
const { formatDate } = require("./utils");

const { webhook: webhook_url } = require("./config");

const hasWebhook = webhook_url
  .toLowerCase()
  .includes("discordapp.com/api/webhooks");

const endpoint = axios.create({
  baseURL: `localhost:3333`,
});

const api = {};
const batch = [];

api.addWebhookBatch = (content) => {
  if (hasWebhook && batch.join("\n").length >= 1750) {
    api.sendWebhookBatch();
    batch.push("Continuação...");
  }
  batch.push(content);
};

api.sendWebhook = (content, color) => {
  if (!hasWebhook) {
    const formatted = content.replace(/(```[a-z]+\n|```)/g, "");
    console.log(formatted);
    return Promise.resolve();
  } else
    return endpoint
      .post(webhook_url, {
        embeds: [
          {
            title: formatDate(),
            description: content,
            color: color,
          },
        ],
      })
      .catch((err) => {
        console.error(
          "Falha ao enviar webhook para o discord (" + err.code + ")"
        );
        console.error(
          "Favor ignorar caso isso seja um caso de Too Many Requests (429)"
        );
      });
};

api.sendWebhookBatch = () => {
  const text = batch.join("\n");
  batch.splice(0, batch.length);
  return api.sendWebhook(text, 0xf1f1f1);
};

module.exports = api;
