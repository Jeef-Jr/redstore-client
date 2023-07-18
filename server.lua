local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

vRP.prepare("vRP/get_blips", "SELECT * FROM redstore_coords")

-- Mude para true se sua base for creative
local creative = true
local framework_network = false

local cfg = not creative and module("vrp", "cfg/groups") or ""

local groups = cfg.groups

-- ________________ FUNÇÕES NATIVAS __________________________

function getSourceUser(id, tipo)
  return tipo == 1 and vRP.getUserId(id) or vRP.getUserSource(id)
end

function setHealthOrArmor(id, tipo, quantidade)
  if tipo == 2 then
    return vRPclient.setArmour(id, 100)
  else
    return vRPclient.setHealth(id, parseInt(quantidade))
  end
end

-- ________________________

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
  local nplayer = getSourceUser(tonumber(id), 1)
  if nplayer then
    TriggerClientEvent('trocarPlaca', nplayer, placa)
  end
end)

RegisterNetEvent("emitirNotify")
AddEventHandler("emitirNotify", function(id, variavel, mensagem, success)
  local nplayer = getSourceUser(tonumber(id), 1)
  if nplayer then
    if success then
      TriggerClientEvent("Notify", nplayer, tostring(variavel), mensagem)
    else
      TriggerClientEvent("Notify", nplayer, variavel, mensagem)
    end
  end
end)


RegisterNetEvent("spawnCar")
AddEventHandler("spawnCar", function(id, vehicle)
  local nplayer = getSourceUser(tonumber(id), 1)
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
  local nplayer = getSourceUser(tonumber(id), 2)
  if nplayer then
    TriggerEvent("notifyServer", isSucesso, mensagem)
  end
end)


AddEventHandler('listBlipMarks', function(coords, refresh)
  TriggerClientEvent("listBlipMarksCliente", -1, coords, false, refresh)
end)

AddEventHandler('removeBlipMark', function(blip)
  TriggerClientEvent("removeBlipMarkCliente", -1, blip)
end)

AddEventHandler("vRP:playerSpawn", function(user_id, source, first_spawn)
  if first_spawn then
    local coords = vRP.query("vRP/get_blips");
    TriggerClientEvent("listBlipMarksCliente", source, coords, true)
  end
end)

RegisterNetEvent("getCoords")
AddEventHandler("getCoords", function(id, callback)
  local nplayer = getSourceUser(tonumber(id), 1)
  if nplayer then
    local x, y, z = vRPclient.getPosition(nplayer)
    if x and y and z then
      local position = { x = x, y = y, z = z }
      callback(position)
    else
      callback(nil)
    end
  else
    callback(nil)
  end
end)

RegisterNetEvent("teleportar")
AddEventHandler("teleportar", function(id, coords)
  if id and coords and coords.x and coords.y and coords.z then
    local user_id = getSourceUser(tonumber(id), 2)

    local x = tonumber(coords.x)
    local y = tonumber(coords.y)
    local z = tonumber(coords.z)
    if user_id then
      vRPclient.teleport(user_id, x, y, z)
    else
      print("ID de usuário inválido.")
    end
  else
    print("Dados de teletransporte inválidos.")
  end
end)

RegisterNetEvent("limparArmas")
AddEventHandler("limparArmas", function(id)
  local nplayer = getSourceUser(tonumber(id), 1)
  local user_id = tonumber(id)
  if user_id then
    vRPclient.replaceWeapons(nplayer, {})
  end
end)


RegisterNetEvent("limparInv")
AddEventHandler("limparInv", function(id)
  local user_id = tonumber(id)
  if user_id then
    return vRP.clearInventory(user_id)
  end
end)


RegisterNetEvent('getInventory')
AddEventHandler('getInventory', function(id, callback)
  local user_id = tonumber(id)
  if user_id then
    local data = vRP.getInventory(user_id)
    callback(data)
  end
end)

RegisterNetEvent('getWeapons')
AddEventHandler('getWeapons', function(id, callback)
  local user_id = tonumber(id)
  if user_id then
    local data = vRPclient.getWeapons(user_id)
    callback(data)
  end
end)

RegisterNetEvent('getItens')
AddEventHandler('getItens', function(callback)
  local data = vRP.itemListRedStore()
  callback(data)
end)


RegisterNetEvent('getMoney')
AddEventHandler('getMoney', function(id, callback)
  local user_id = tonumber(id)
  local wallet = vRP.getMoney(user_id)
  local bank = vRP.getBankMoney(user_id)
  callback({ wallet = wallet, bank = bank })
end)

RegisterNetEvent('updateMoney')
AddEventHandler('updateMoney', function(id, wallet, bank, callback)
  local user_id = getSourceUser(tonumber(id), 1)

  vRP.setMoney(user_id, wallet)
  vRP.setBankMoney(user_id, bank)

  callback(true)
end)


RegisterNetEvent('updadeVidaJogador')
AddEventHandler('updadeVidaJogador', function(id, quantidade, callback)
  local nplayer = getSourceUser(tonumber(id), 1)
  if nplayer then
    setHealthOrArmor(nplayer, 1, quantidade)
    callback(true)
  end
end)

RegisterNetEvent('updadeVidaJogadores')
AddEventHandler('updadeVidaJogadores', function(quantidade, callback)
  local users = vRP.userList();
  for k, v in pairs(users) do
    local id = getSourceUser(k, 1)
    if id then
      setHealthOrArmor(id, 1, quantidade)
      TriggerClientEvent("Notify", id, "sucesso", "Administração recuperou sua vida.")
    end
  end
  callback(true)
end)


RegisterNetEvent('updateColeteJogador')
AddEventHandler('updateColeteJogador', function(id, callback)
  local nplayer = getSourceUser(tonumber(id), 2)
  if nplayer then
    setHealthOrArmor(nplayer, 2, 0)
    callback(true)
  end
end)

RegisterNetEvent('tpToJogador')
AddEventHandler('tpToJogador', function(id, idJogador, callback)
  local nplayer = getSourceUser(tonumber(id), 2)
  local tplayer = getSourceUser(tonumber(idJogador), 2)
  if tplayer then
    vRPclient.teleport(nplayer, vRPclient.getPosition(tplayer))
    callback(true)
  end
end)

RegisterNetEvent('tpToMeJogador')
AddEventHandler('tpToMeJogador', function(id, idJogador, callback)
  local nplayer = getSourceUser(tonumber(id), 2)
  local tplayer = getSourceUser(tonumber(idJogador))
  if tplayer then
    local x, y, z = vRPclient.getPosition(nplayer)
    vRPclient.teleport(tplayer, x, y, z)

    callback(true)
  end
end)


RegisterNetEvent('tpToWayJogador')
AddEventHandler('tpToWayJogador', function(id, callback)
  local nplayer = getSourceUser(tonumber(id), 2)
  if nplayer then
    TriggerClientEvent('tptoway', nplayer)
    callback(true)
  end
end)
