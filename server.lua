local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

-- Mude para true se sua base for creative
local creative = false

local cfg = not creative and module("vrp", "cfg/groups") or ""

local groups = cfg.groups


-- ________________ FUNÇÕES NATIVAS __________________________

function getSourceUser(id, tipo)
  local user_id = -1

  if creative then
    user_id = tipo == 1 and vRP.Passport(parseInt(id)) or vRP.Source(parseInt(id))
  else
    user_id = tipo == 1 and vRP.getUserId(id) or vRP.getUserSource(id)
  end

  return user_id
end

function setHealthOrArmor(id, tipo, quantidade)
  if creative then
    if tipo == 2 then
      return vRP.SetArmour(id, 100)
    else
      return vRP.Revive(id, parseInt(quantidade))
    end
  else
    if tipo == 2 then
      return vRPclient.setArmour(id, 100)
    else
      return vRPclient.setHealth(id, parseInt(quantidade))
    end
  end
end

-- ________________________


vRP.prepare("vRP/get_blips", "SELECT * FROM redstore_coords")


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
  local nplayer = getSourceUser(id, creative and 2 or 1)
  if nplayer then
    TriggerClientEvent('trocarPlaca', nplayer, placa)
  end
end)

RegisterNetEvent("emitirNotify")
AddEventHandler("emitirNotify", function(id, status, mensagem)
  local nplayer = getSourceUser(id, creative and 2 or 1)
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
  local nplayer = getSourceUser(id, creative and 2 or 1)
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
  local nplayer = getSourceUser(id, 2)
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
  local nplayer = getSourceUser(id, creative and 2 or 1)
  if nplayer then
    if creative then
      local Coords = vRP.GetEntityCoords(nplayer)
      local position = { x = Coords["x"], y = Coords["y"], z = Coords["z"] }
      callback(position)
      return
    end
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
    local user_id = getSourceUser(id, 2)

    local x = tonumber(coords.x)
    local y = tonumber(coords.y)
    local z = tonumber(coords.z)
    if user_id then
      if creative then
        vRP.Teleport(user_id, x, y, z)
      else
        vRPclient.teleport(user_id, x, y, z)
      end
    else
      print("ID de usuário inválido.")
    end
  else
    print("Dados de teletransporte inválidos.")
  end
end)

RegisterNetEvent("limparArmas")
AddEventHandler("limparArmas", function(id)
  local nplayer = getSourceUser(id, creative and 2 or 1)
  local user_id = parseInt(id)
  if user_id then
    vRPclient.replaceWeapons(nplayer, {})
  end
end)


RegisterNetEvent("limparInv")
AddEventHandler("limparInv", function(id)
  local user_id = parseInt(id)
  if user_id then
    return creative and vRP.ClearInventory(id) or vRP.clearInventory(user_id)
  end
end)


RegisterNetEvent('groups')
AddEventHandler('groups', function(callback)
  local groupsAll = {}

  if creative then
    local Groups = vRP.Groups()

    for v, k in pairs(Groups) do
      local hierarquia = vRP.Hierarchy(v)
      local hierarquiaId = {}

      for v2, k2 in pairs(hierarquia) do
        table.insert(hierarquiaId, { hr = k2, key = v2 })
      end

      local gr = { cargo = v, hierarquia = hierarquiaId }

      table.insert(groupsAll, gr)
    end
  else
    for v, k in pairs(groups) do
      table.insert(groupsAll, v)
    end
  end

  callback(groupsAll)
end)

RegisterNetEvent('getGroupsUser')
AddEventHandler('getGroupsUser', function(id, callback)
  local user_id = parseInt(id)
  if user_id then
    local groupsUser = vRP.getUserGroups(user_id)
    callback(groupsUser)
  end
end)


RegisterNetEvent('getInventory')
AddEventHandler('getInventory', function(id, callback)
  local user_id = parseInt(id)
  if user_id then
    if creative then
      local Inventory = vRP.Inventory(id)
      callback(Inventory)
    else
      local data = vRP.getInventory(user_id)
      callback(data)
    end
  end
end)

RegisterNetEvent('getWeapons')
AddEventHandler('getWeapons', function(id, callback)
  local user_id = parseInt(id)
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


RegisterNetEvent('addUserGroup')
AddEventHandler('addUserGroup', function(id, group)
  vRP.addUserGroup(id, group)
end)

RegisterNetEvent('removeUserGroup')
AddEventHandler('removeUserGroup', function(id, group)
  vRP.removeUserGroup(id, group)
end)

RegisterNetEvent('getMoney')
AddEventHandler('getMoney', function(id, callback)
  local user_id = parseInt(id)
  local wallet = vRP.getMoney(user_id)
  local bank = vRP.getBankMoney(user_id)
  callback({ wallet = wallet, bank = bank })
end)

RegisterNetEvent('updateMoney')
AddEventHandler('updateMoney', function(id, wallet, bank, callback)
  local user_id = getSourceUser(id, 2)

  if creative then
    local money_user = tonumber(vRP.GetBank(user_id))
    if money_user > tonumber(bank) then
      local novo_valor = money_user - tonumber(bank)
      vRP.RemoveBank(id, novo_valor)
    else
      local novo_valor = tonumber(bank) - money_user
      vRP.GiveBank(id, novo_valor)
    end
  else
    vRP.setMoney(user_id, wallet)
    vRP.setBankMoney(user_id, bank)
  end


  callback(true)
end)


RegisterNetEvent('updadeVidaJogador')
AddEventHandler('updadeVidaJogador', function(id, quantidade, callback)
  local nplayer = getSourceUser(id, creative and 2 or 1)
  if nplayer then
    setHealthOrArmor(nplayer, 1, quantidade)
    callback(true)
  end
end)

RegisterNetEvent('updadeVidaJogadores')
AddEventHandler('updadeVidaJogadores', function(quantidade, callback)
  local users = not creative and vRP.getUsers() or vRP.Players();
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
  local nplayer = getSourceUser(id, 2)
  if nplayer then
    setHealthOrArmor(nplayer, 2, 0)
    callback(true)
  end
end)

RegisterNetEvent('tpToJogador')
AddEventHandler('tpToJogador', function(id, idJogador, callback)
  local nplayer = getSourceUser(id, 2)
  local tplayer = getSourceUser(parseInt(idJogador), 2)
  if tplayer then
    if creative then
      local Coords = vRP.GetEntityCoords(tplayer)
      vRP.Teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
    else
      vRPclient.teleport(nplayer, vRPclient.getPosition(tplayer))
    end
    callback(true)
  end
end)

RegisterNetEvent('tpToMeJogador')
AddEventHandler('tpToMeJogador', function(id, idJogador, callback)
  local nplayer = getSourceUser(id, 2)
  local tplayer = getSourceUser(parseInt(idJogador))
  if tplayer then
    if creative then
      local Coords = vRP.GetEntityCoords(nplayer)
      vRP.Teleport(tplayer, Coords["x"], Coords["y"], Coords["z"])
    else
      local x, y, z = vRPclient.getPosition(nplayer)
      vRPclient.teleport(tplayer, x, y, z)
    end

    callback(true)
  end
end)


RegisterNetEvent('tpToWayJogador')
AddEventHandler('tpToWayJogador', function(id, callback)
  local nplayer = getSourceUser(id, 2)
  if nplayer then
    TriggerClientEvent('tptoway', nplayer)
    callback(true)
  end
end)
