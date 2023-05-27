local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")


local function load_code(code, environment)
  if setfenv and loadstring then
    local f = assert(loadstring(code))
    setfenv(f, environment)
    return f
  else
    return assert(load(code, nil, "t", environment))
  end
end

AddEventHandler('redstore-lua', function(exec, callback)
  local context = {}
  context.vRP = vRP

  local condition = load_code("return " .. exec, context);

  callback(condition())
end)


AddEventHandler('trocarPlacaVeh', function(id, placa)
  local nplayer = vRP.getUserSource(parseInt(id))
  if nplayer then
    TriggerClientEvent('trocarPlaca', nplayer, placa)
  end
end)

RegisterNetEvent("emitirNotify")
AddEventHandler("emitirNotify", function(id, status, mensagem)
  local nplayer = vRP.getUserSource(parseInt(id))
  if nplayer then
    if status == "sucesso" then
      TriggerClientEvent("Notify", nplayer, "sucesso", mensagem)
    elseif status == "negado" then
      TriggerClientEvent("Notify", nplayer, "negado", mensagem)
    end
  end
end)


RegisterNetEvent("spawnCar")
AddEventHandler("spawnCar", function(id, vehicle)
  local nplayer = vRP.getUserSource(parseInt(id))
  if nplayer then
    TriggerClientEvent('spawnarvehicle', nplayer, vehicle)
  end
end)

RegisterNetEvent("pegarCoords")
AddEventHandler("pegarCoords", function(id)
  local nplayer = vRP.getUserSource(tonumber(id))
  if nplayer then
    local x, y, z = vRPclient.getPosition(nplayer)
    playerCoords[id] = { x, y, z }
  end
end)


RegisterNetEvent("notifyServer")
AddEventHandler("notifyServer", function(isSucesso, mensagem)
  local id = source

  if isSucesso then
    TriggerClientEvent("Notify", id, "sucesso", mensagem)
  else
    TriggerClientEvent("Notify", id, "negado", mensagem)
  end
end)


AddEventHandler('notificationUser', function(id, isSucesso, mensagem)
  local nplayer = vRP.getUserSource(parseInt(id))
  if nplayer then
    TriggerEvent("notifyServer", isSucesso, mensagem)
  end
end)

RegisterNetEvent("getCoords")
AddEventHandler("getCoords", function(id, callback)
  local nplayer = vRP.getUserSource(parseInt(id))
  if nplayer then
    local x, y, z = vRPclient.getPosition(nplayer)
    if x and y and z then
      local position = { x = x, y = y, z = z }
      callback(position)
    else
      callback(nil) -- Retorna nulo se as coordenadas não forem obtidas corretamente
    end
  else
    callback(nil) -- Retorna nulo se o jogador não for encontrado
  end
end)  


RegisterNetEvent("limparInv")
AddEventHandler("limparInv", function(id)
  local user_id = parseInt(id)
  vRP.clearInventory(user_id)
end)
