local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")


-- ________________ FUNÇÕES NATIVAS __________________________

function getSourceUser(id, tipo)
    return tipo == 1 and vRP.getUserId(parseInt(id)) or vRP.userSource(parseInt(id))
end

function setHealthOrArmor(id, tipo, quantidade)
    if tipo == 2 then
        return vRP.setArmour(id, 100)
    else
        return vRPclient.revivePlayer(id, parseInt(quantidade))
    end
end

-- ___________________________________________________________


vRP.prepare("vRP/get_blips", "SELECT * FROM redstore_coords")


AddEventHandler('trocarPlacaVeh_summerz', function(id, placa)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        TriggerClientEvent('trocarPlaca', nplayer, placa)
    end
end)

RegisterNetEvent("spawnCar_summerz")
AddEventHandler("spawnCar_summerz", function(id, vehicle)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        TriggerClientEvent('spawnarvehicle', nplayer, vehicle)
    end
end)

RegisterNetEvent("pegarCoords_summerz")
AddEventHandler("pegarCoords_summerz", function(id)
    local nplayer = vRP.getUserSource(tonumber(id))
    if nplayer then
        local x, y, z = vRPclient.getPosition(nplayer)
        playerCoords[id] = { x, y, z }
    end
end)

-- AddEventHandler("vRP:playerSpawn", function(user_id, source, first_spawn)
--     if first_spawn then
--         local coords = vRP.query("vRP/get_blips");
--         TriggerClientEvent("listBlipMarksCliente", source, coords, true)
--     end
-- end)

RegisterNetEvent("getCoords_summerz")
AddEventHandler("getCoords_summerz", function(id, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        local ped = GetPlayerPed(nplayer)
        local coords = GetEntityCoords(ped)
        local position = { x = mathLegth(coords["x"]), y = mathLegth(coords["y"]), z = mathLegth(coords["z"]) }
        callback(position)
    else
        callback(nil)
    end
end)

RegisterNetEvent("teleportar_summerz")
AddEventHandler("teleportar_summerz", function(id, coords)
    if id and coords and coords.x and coords.y and coords.z then
        local user_id = getSourceUser(tonumber(id), 2)

        local x = tonumber(coords.x)
        local y = tonumber(coords.y)
        local z = tonumber(coords.z)
        if user_id then
            vRP.teleport(user_id, x, y, z)
        else
            print("ID de usuário inválido.")
        end
    else
        print("Dados de teletransporte inválidos.")
    end
end)


RegisterNetEvent("limparInv_summerz")
AddEventHandler("limparInv_summerz", function(id)
    local user_id = tonumber(id)
    if user_id then
        return vRP.ClearInventory(id)
    end
end)


RegisterNetEvent('getInventory_summerz')
AddEventHandler('getInventory_summerz', function(id, callback)
    local user_id = tonumber(id)
    if user_id then
        local Inventory = vRP.userInventory(id)
        callback(Inventory)
    end
end)

RegisterNetEvent('getWeapons_summerz')
AddEventHandler('getWeapons_summerz', function(id, callback)
    local user_id = tonumber(id)
    if user_id then
        local data = vRPclient.getWeapons(user_id)
        callback(data)
    end
end)


RegisterNetEvent('getMoney_summerz')
AddEventHandler('getMoney_summerz', function(id, callback)
    local user_id = tonumber(id)
    local bank = vRP.getBank(user_id)
    callback({ wallet = 0, bank = bank })
end)

RegisterNetEvent('updateMoney_summerz')
AddEventHandler('updateMoney_summerz', function(id, wallet, bank, callback)
    vRP.setNovoValor(id, bank)
    callback(true)
end)


RegisterNetEvent('updadeVidaJogador_summerz')
AddEventHandler('updadeVidaJogador_summerz', function(id, quantidade, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        setHealthOrArmor(nplayer, 1, quantidade)
        callback(true)
    end
end)

RegisterNetEvent('updadeVidaJogadores_summerz')
AddEventHandler('updadeVidaJogadores_summerz', function(quantidade, callback)
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


RegisterNetEvent('updateColeteJogador_summerz')
AddEventHandler('updateColeteJogador_summerz', function(id, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        setHealthOrArmor(nplayer, 2, 0)
        callback(true)
    end
end)

RegisterNetEvent('tpToJogador_summerz')
AddEventHandler('tpToJogador_summerz', function(id, idJogador, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    local tplayer = getSourceUser(tonumber(idJogador), 2)
    if tplayer then
        local ped = GetPlayerPed(tplayer)
        local Coords = GetEntityCoords(ped)
        vRP.teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
        callback(true)
    end
end)

RegisterNetEvent('tpToMeJogador_summerz')
AddEventHandler('tpToMeJogador_summerz', function(id, idJogador, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    local tplayer = getSourceUser(tonumber(idJogador))
    if tplayer then
        local ped = GetPlayerPed(nplayer)
        local Coords =  GetEntityCoords(ped)
        vRP.teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
        callback(true)
    end
end)


RegisterNetEvent('tpToWayJogador_summerz')
AddEventHandler('tpToWayJogador_summerz', function(id, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        TriggerClientEvent('tptoway', nplayer)
        callback(true)
    end
end)
