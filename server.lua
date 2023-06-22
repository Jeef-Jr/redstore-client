local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")
local cfg = module("vrp", "cfg/groups")

local groups = cfg.groups

-- Adicionar RedStore
vRP.prepare("vRP/get_groups",
  "SELECT RUG.user_id AS 'user_id', RG.nome AS 'name_group', RGP.permissao AS 'permission' FROM redstore_users_groups AS RUG JOIN redstore_groups AS RG JOIN redstore_groups_permissions AS RGP ON RUG.`group` = RG.id AND RG.id = RGP.idRelation WHERE RUG.user_id = @user_id")

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


AddEventHandler('listBlipMarks', function(coords, refresh)
  TriggerClientEvent("listBlipMarksCliente", -1, coords, false, refresh)
end)

AddEventHandler('removeBlipMark', function(blip)
  print("Chamou o delete")
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
  local nplayer = vRP.getUserSource(parseInt(id))
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
    local user_id = vRP.getUserSource(parseInt(id))

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
  local nplayer = vRP.getUserSource(parseInt(id))
  local user_id = parseInt(id)
  if user_id then
    vRPclient.replaceWeapons(nplayer, {})
  end
end)


RegisterNetEvent("limparInv")
AddEventHandler("limparInv", function(id)
  local user_id = parseInt(id)
  if user_id then
    vRP.clearInventory(user_id)
  end
end)


RegisterNetEvent('groups')
AddEventHandler('groups', function(callback)
  local groupsAll = {}

  for v, k in pairs(groups) do
    table.insert(groupsAll, v)
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
    local data = vRP.getInventory(user_id)
    callback(data)
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
  local user_id = parseInt(id)

  vRP.setMoney(user_id, wallet)
  vRP.setBankMoney(user_id, bank)

  callback(true)
end)
