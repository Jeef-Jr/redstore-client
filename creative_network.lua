local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")


-- ________________ FUNÇÕES NATIVAS __________________________
local network = true


function getSourceUser(id, tipo)
    return tonumber(tipo) == 1 and vRP.Passport(id) or vRP.Source(id)
end

function setHealthOrArmor(id, tipo, quantidade)
    if tipo == 2 then
        return vRP.SetArmour(id, 100)
    else
        return vRPclient.Revive(id, tonumber(quantidade))
    end
end

-- ___________________________________________________________



AddEventHandler("Connect", function(user_id, source)
    if network then
        TriggerEvent('playerFirstSpawn', user_id)
        TriggerEvent('refreshBlip', user_id)
    end
end)

AddEventHandler('listBlipMarksNetwork', function(user, coords)
    TriggerClientEvent("listBlipMarksCliente", user, coords, true)
end)


AddEventHandler('trocarPlacaVeh_network', function(id, placa)
    if network then
        local nplayer = vRP.Source(id)
        if nplayer then
            TriggerClientEvent('trocarPlaca', nplayer, placa)
        end
    end
end)

RegisterNetEvent("spawnCar_network")
AddEventHandler("spawnCar_network", function(id, vehicle)
    if network then
        local nplayer = vRP.Source(tonumber(id))
        if nplayer then
            TriggerClientEvent('spawnarvehicle', nplayer, vehicle)
        end
    end
end)

RegisterNetEvent("pegarCoords_network")
AddEventHandler("pegarCoords_network", function(id)
    if network then
        local nplayer = vRP.getUserSource(tonumber(id))
        if nplayer then
            local x, y, z = vRPclient.getPosition(nplayer)
            playerCoords[id] = { x, y, z }
        end
    end
end)


RegisterNetEvent("getCoords_network")
AddEventHandler("getCoords_network", function(id, callback)
    if network then
        local nplayer = vRP.Source(id)
        if nplayer then
            local ped = GetPlayerPed(nplayer)
            local coords = GetEntityCoords(ped)
            local position = { x = coords["x"], y = coords["y"], z = coords["z"] }
            callback(position)
        else
            callback(nil)
        end
    end
end)

RegisterNetEvent("teleportar_network")
AddEventHandler("teleportar_network", function(id, coords)
    if network then
        if id and coords and coords.x and coords.y and coords.z then
            local user_id = vRP.Source(id)

            local x = tonumber(coords.x)
            local y = tonumber(coords.y)
            local z = tonumber(coords.z)
            if user_id then
                vRP.Teleport(user_id, x, y, z)
            else
                print("ID de usuário inválido.")
            end
        else
            print("Dados de teletransporte inválidos.")
        end
    end
end)


RegisterNetEvent("limparInv_network")
AddEventHandler("limparInv_network", function(id)
    if network then
        local user_id = tonumber(id)
        if user_id then
            return vRP.ClearInventory(id)
        end
    end
end)


RegisterNetEvent('getInventory_network')
AddEventHandler('getInventory_network', function(id, callback)
    if network then
        local user_id = tonumber(id)
        if user_id then
            local Inventory = vRP.Inventory(id)
            callback(Inventory)
        end
    end
end)

RegisterNetEvent('getWeapons_network')
AddEventHandler('getWeapons_network', function(id, callback)
    if network then
        local user_id = tonumber(id)
        if user_id then
            local data = vRPclient.getWeapons(user_id)
            callback(data)
        end
    end
end)


RegisterNetEvent('getMoney_network')
AddEventHandler('getMoney_network', function(id, callback)
    if network then
        local user_id = tonumber(id)
        local bank = vRP.getBank(user_id)
        callback({ wallet = 0, bank = bank })
    end
end)

RegisterNetEvent('updateMoney_network')
AddEventHandler('updateMoney_network', function(id, wallet, bank, callback)
    if network then
        local user_id = vRP.Passport(id)
        local money_user = tonumber(vRP.GetBank(user_id))

        if money_user > tonumber(bank) then
            local novo_valor = money_user - tonumber(bank)
            vRP.RemoveBank(id, novo_valor)
        else
            local novo_valor = tonumber(bank) - money_user
            vRP.GiveBank(id, novo_valor)
        end
        callback(true)
    end
end)


RegisterNetEvent('updadeVidaJogador_network')
AddEventHandler('updadeVidaJogador_network', function(id, quantidade, callback)
    if network then
        local nplayer = vRP.Source(id)
        if nplayer then
            vRPclient.Revive(nplayer, tonumber(quantidade))
            callback(true)
        end
    end
end)

RegisterNetEvent('updadeVidaJogadores_network')
AddEventHandler('updadeVidaJogadores_network', function(quantidade, callback)
    if network then
        local users = vRP.Players();
        for k, v in pairs(users) do
            local id = vRP.Passport(k)
            if id then
                vRPclient.Revive(id, tonumber(quantidade))
                TriggerClientEvent("Notify", id, "sucesso", "Administração recuperou sua vida.")
            end
        end
        callback(true)
    end
end)


RegisterNetEvent('updateColeteJogador_network')
AddEventHandler('updateColeteJogador_network', function(id, callback)
    if network then
        local nplayer = vRP.Source(id)
        if nplayer then
            vRP.SetArmour(id, 100)
            callback(true)
        end
    end
end)

RegisterNetEvent('tpToJogador_network')
AddEventHandler('tpToJogador_network', function(id, idJogador, callback)
    if network then
        local nplayer = vRP.Source(id)
        local tplayer = vRP.Source(idJogador)
        if tplayer then
            local ped = GetPlayerPed(tplayer)
            local Coords = GetEntityCoords(ped)
            vRP.Teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
            callback(true)
        end
    end
end)

RegisterNetEvent('tpToMeJogador_network')
AddEventHandler('tpToMeJogador_network', function(id, idJogador, callback)
    if network then
        local nplayer = vRP.Source(id)
        local tplayer = vRP.Source(idJogador)
        if tplayer then
            local ped = GetPlayerPed(nplayer)
            local Coords = GetEntityCoords(ped)
            vRP.Teleport(nplayer, Coords["x"], Coords["y"], Coords["z"])
            callback(true)
        end
    end
end)


RegisterNetEvent('tpToWayJogador_network')
AddEventHandler('tpToWayJogador_network', function(id, callback)
    if network then
        local nplayer = vRP.Source(id)
        if nplayer then
            TriggerClientEvent('tptoway', nplayer)
            callback(true)
        end
    end
end)
