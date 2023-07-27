local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

vRP.prepare("vRP/get_blips", "SELECT * FROM redstore_coords")

-- ________________ FUNÇÕES NATIVAS __________________________

local base_summerz = false

-----------------------------------------------------------------------------------------------------------------------------------------
-- USERSYNC
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNetEvent("emitirNotifySummerz")
AddEventHandler("emitirNotifySummerz", function(id, variavel, mensagem, success, isSource, time)
  if base_summerz then
    local nplayer = isSource and vRP.userSource(id) or vRP.getUserId(tonumber(id))
    if nplayer then
      if success then
        TriggerClientEvent("Notify", nplayer, tostring(variavel), mensagem, tonumber(time) > 0 and time)
      else
        TriggerClientEvent("Notify", nplayer, variavel, mensagem, tonumber(time) > 0 and time)
      end
    end
  end
end)

AddEventHandler("playerConnect", function(user_id, source)
    if base_summerz then
        local coords = vRP.query("vRP/get_blips");

        TriggerEvent('playerFirstSpawn', user_id)
        TriggerClientEvent("listBlipMarksCliente", user_id, coords, true)
    end
end)


AddEventHandler('trocarPlacaVeh_summerz', function(id, placa)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            TriggerClientEvent('trocarPlaca', nplayer, placa)
        end
    end
end)

RegisterNetEvent("spawnCar_summerz")
AddEventHandler("spawnCar_summerz", function(id, vehicle)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            TriggerClientEvent('spawnarvehicle', nplayer, vehicle)
        end
    end
end)

RegisterNetEvent("pegarCoords_summerz")
AddEventHandler("pegarCoords_summerz", function(id)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            local x, y, z = vRPclient.getPosition(nplayer)
            playerCoords[id] = { x, y, z }
        end
    end
end)


RegisterNetEvent("getCoords_summerz")
AddEventHandler("getCoords_summerz", function(id, callback)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            local ped = GetPlayerPed(nplayer)
            local coords = GetEntityCoords(ped)
            local position = { x = mathLegth(coords["x"]), y = mathLegth(coords["y"]), z = mathLegth(coords["z"]) }
            callback(position)
        else
            callback(nil)
        end
    end
end)

RegisterNetEvent("teleportar_summerz")
AddEventHandler("teleportar_summerz", function(id, coords)
    if base_summerz then
        if id and coords and coords.x and coords.y and coords.z then
            local user_id = vRP.userSource(tonumber(id))

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
    end
end)


RegisterNetEvent("limparInv_summerz")
AddEventHandler("limparInv_summerz", function(id)
    if base_summerz then
        local user_id = tonumber(id)
        if user_id then
            return vRP.ClearInventory(id)
        end
    end
end)


RegisterNetEvent('getInventory_summerz')
AddEventHandler('getInventory_summerz', function(id, callback)
    if base_summerz then
        local user_id = tonumber(id)
        if user_id then
            local Inventory = vRP.userInventory(id)
            callback(Inventory)
        end
    end
end)

RegisterNetEvent('getWeapons_summerz')
AddEventHandler('getWeapons_summerz', function(id, callback)
    if base_summerz then
        local user_id = tonumber(id)
        if user_id then
            local data = vRPclient.getWeapons(user_id)
            callback(data)
        end
    end
end)


RegisterNetEvent('getMoney_summerz')
AddEventHandler('getMoney_summerz', function(id, callback)
    if base_summerz then
        local user_id = tonumber(id)
        local bank = vRP.getBank(user_id)
        callback({ wallet = 0, bank = bank })
    end
end)

RegisterNetEvent('updateMoney_summerz')
AddEventHandler('updateMoney_summerz', function(id, wallet, bank, callback)
    if base_summerz then
        vRP.setNovoValor(id, bank)
        callback(true)
    end
end)


RegisterNetEvent('updadeVidaJogador_summerz')
AddEventHandler('updadeVidaJogador_summerz', function(id, quantidade, callback)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            vRPclient.revivePlayer(nplayer, tonumber(quantidade))
            callback(true)
        end
    end
end)

RegisterNetEvent('updadeVidaJogadores_summerz')
AddEventHandler('updadeVidaJogadores_summerz', function(quantidade, callback)
    if base_summerz then
        local users = vRP.userList();
        for k, v in pairs(users) do
            local id = vRP.getUserId(k)
            if id then
                vRPclient.revivePlayer(id, tonumber(quantidade))
                TriggerClientEvent("Notify", id, "sucesso", "Administração recuperou sua vida.")
            end
        end
        callback(true)
    end
end)


RegisterNetEvent('updateColeteJogador_summerz')
AddEventHandler('updateColeteJogador_summerz', function(id, callback)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            vRP.setArmour(nplayer, 100)
            callback(true)
        end
    end
end)

RegisterNetEvent('tpToJogador_summerz')
AddEventHandler('tpToJogador_summerz', function(id, idJogador, callback)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        local tplayer = vRP.userSource(tonumber(idJogador))
        if tplayer then
            local ped = GetPlayerPed(tplayer)
            local Coords = GetEntityCoords(ped)
            vRP.teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
            callback(true)
        end
    end
end)

RegisterNetEvent('tpToMeJogador_summerz')
AddEventHandler('tpToMeJogador_summerz', function(id, idJogador, callback)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        local tplayer = vRP.userSource(tonumber(idJogador))
        if tplayer then
            local ped = GetPlayerPed(nplayer)
            local Coords = GetEntityCoords(ped)
            vRP.teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
            callback(true)
        end
    end
end)


RegisterNetEvent('tpToWayJogador_summerz')
AddEventHandler('tpToWayJogador_summerz', function(id, callback)
    if base_summerz then
        local nplayer = vRP.userSource(tonumber(id))
        if nplayer then
            TriggerClientEvent('tptoway', nplayer)
            callback(true)
        end
    end
end)
