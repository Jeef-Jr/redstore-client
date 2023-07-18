local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

-- ________________ FUNÇÕES NATIVAS __________________________

function getSourceUser(id, tipo)
    return tipo == 1 and vRP.Passport(parseInt(id)) or vRP.Source(parseInt(id))
end

function setHealthOrArmor(id, tipo, quantidade)
    if tipo == 2 then
        return vRP.SetArmour(id, 100)
    else
        return vRPclient.Revive(id, parseInt(quantidade))
    end
end

-- ___________________________________________________________

vRP.prepare("vRP/get_blips", "SELECT * FROM redstore_coords")

-----------------------------------------------------------------------------------------------------------------------------------------
-- USERSYNC
local coords = vRP.query("vRP/get_blips");
-----------------------------------------------------------------------------------------------------------------------------------------


AddEventHandler("playerConnect", function(user_id, source)
    TriggerEvent('playerFirstSpawn', user_id)
    TriggerClientEvent("listBlipMarksCliente", user_id, coords, true)
end)


AddEventHandler('trocarPlacaVeh_network', function(id, placa)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        TriggerClientEvent('trocarPlaca', nplayer, placa)
    end
end)

RegisterNetEvent("spawnCar_network")
AddEventHandler("spawnCar_network", function(id, vehicle)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        TriggerClientEvent('spawnarvehicle', nplayer, vehicle)
    end
end)

RegisterNetEvent("pegarCoords_network")
AddEventHandler("pegarCoords_network", function(id)
    local nplayer = vRP.getUserSource(tonumber(id))
    if nplayer then
        local x, y, z = vRPclient.getPosition(nplayer)
        playerCoords[id] = { x, y, z }
    end
end)


RegisterNetEvent("getCoords_network")
AddEventHandler("getCoords_network", function(id, callback)
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

RegisterNetEvent("teleportar_network")
AddEventHandler("teleportar_network", function(id, coords)
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


RegisterNetEvent("limparInv_network")
AddEventHandler("limparInv_network", function(id)
    local user_id = tonumber(id)
    if user_id then
        return vRP.ClearInventory(id)
    end
end)


RegisterNetEvent('getInventory_network')
AddEventHandler('getInventory_network', function(id, callback)
    local user_id = tonumber(id)
    if user_id then
        local Inventory = vRP.Inventory(id)
        callback(Inventory)
    end
end)

RegisterNetEvent('getWeapons_network')
AddEventHandler('getWeapons_network', function(id, callback)
    local user_id = tonumber(id)
    if user_id then
        local data = vRPclient.getWeapons(user_id)
        callback(data)
    end
end)


RegisterNetEvent('getMoney_network')
AddEventHandler('getMoney_network', function(id, callback)
    local user_id = tonumber(id)
    local bank = vRP.getBank(user_id)
    callback({ wallet = 0, bank = bank })
end)

RegisterNetEvent('updateMoney_network')
AddEventHandler('updateMoney_network', function(id, wallet, bank, callback)
    local user_id = getSourceUser(tonumber(id), 1)
    local money_user = tonumber(vRP.GetBank(user_id))

    if money_user > tonumber(bank) then
        local novo_valor = money_user - tonumber(bank)
        vRP.RemoveBank(id, novo_valor)
    else
        local novo_valor = tonumber(bank) - money_user
        vRP.GiveBank(id, novo_valor)
    end
    callback(true)
end)


RegisterNetEvent('updadeVidaJogador_network')
AddEventHandler('updadeVidaJogador_network', function(id, quantidade, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        setHealthOrArmor(nplayer, 1, quantidade)
        callback(true)
    end
end)

RegisterNetEvent('updadeVidaJogadores_network')
AddEventHandler('updadeVidaJogadores_network', function(quantidade, callback)
    local users = vRP.Players();
    for k, v in pairs(users) do
        local id = getSourceUser(k, 1)
        if id then
            setHealthOrArmor(id, 1, quantidade)
            TriggerClientEvent("Notify", id, "sucesso", "Administração recuperou sua vida.")
        end
    end
    callback(true)
end)


RegisterNetEvent('updateColeteJogador_network')
AddEventHandler('updateColeteJogador_network', function(id, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        setHealthOrArmor(nplayer, 2, 0)
        callback(true)
    end
end)

RegisterNetEvent('tpToJogador_network')
AddEventHandler('tpToJogador_network', function(id, idJogador, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    local tplayer = getSourceUser(tonumber(idJogador), 2)
    if tplayer then
        local ped = GetPlayerPed(tplayer)
        local Coords = GetEntityCoords(ped)
        vRP.Teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
        callback(true)
    end
end)

RegisterNetEvent('tpToMeJogador_network')
AddEventHandler('tpToMeJogador_network', function(id, idJogador, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    local tplayer = getSourceUser(tonumber(idJogador))
    if tplayer then
        local ped = GetPlayerPed(nplayer)
        local Coords = GetEntityCoords(ped)
        vRP.Teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
        callback(true)
    end
end)


RegisterNetEvent('tpToWayJogador_network')
AddEventHandler('tpToWayJogador_network', function(id, callback)
    local nplayer = getSourceUser(tonumber(id), 2)
    if nplayer then
        TriggerClientEvent('tptoway', nplayer)
        callback(true)
    end
end)
