local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")

RegisterNetEvent("trocarPlaca")
AddEventHandler("trocarPlaca", function(placa)
	local ped = PlayerPedId()
	local vehicle = GetVehiclePedIsIn(ped)

	if IsEntityAVehicle(vehicle) then
		SetVehicleNumberPlateText(vehicle, placa)
		TriggerServerEvent("notifyServer", true, "Placa trocada com sucesso!")
	else
		TriggerServerEvent("notifyServer", false, "Você não está dentro de um veículo!")
	end
end)


RegisterNetEvent("notifyIntermedio")
AddEventHandler("notifyIntermedio", function(isSucesso, mensagem)
	TriggerServerEvent("notifyServer", isSucesso, mensagem)
end)


RegisterNetEvent('spawnarvehicle')
AddEventHandler('spawnarvehicle', function(name)
	local mhash = GetHashKey(name)
	while not HasModelLoaded(mhash) do
		RequestModel(mhash)
		Citizen.Wait(10)
	end

	if HasModelLoaded(mhash) then
		local ped = PlayerPedId()
		local nveh = CreateVehicle(mhash, GetEntityCoords(ped), GetEntityHeading(ped), true, false)

		NetworkRegisterEntityAsNetworked(nveh)
		while not NetworkGetEntityIsNetworked(nveh) do
			NetworkRegisterEntityAsNetworked(nveh)
			Citizen.Wait(1)
		end

		SetVehicleOnGroundProperly(nveh)
		SetVehicleAsNoLongerNeeded(nveh)
		SetVehicleIsStolen(nveh, false)
		SetPedIntoVehicle(ped, nveh, -1)
		SetVehicleNeedsToBeHotwired(nveh, false)
		SetEntityInvincible(nveh, false)
		SetVehicleNumberPlateText(nveh, vRP.getRegistrationNumber())
		Citizen.InvokeNative(0xAD738C3085FE7E11, nveh, true, true)
		SetVehicleHasBeenOwnedByPlayer(nveh, true)
		SetVehRadioStation(nveh, "OFF")

		SetModelAsNoLongerNeeded(mhash)

		TriggerServerEvent("notifyServer", true, "Um veículo foi gerado para você usar, aproveite.")
	end
end)


-- Muda a cor do tab

Citizen.CreateThread(function()
	ReplaceHudColour(116, 6) -- Vermelho
end)
Citizen.CreateThread(function()
	local ped = PlayerPedId(ped)
	local nome = GetPlayerName(ped)
end)

local blips = {}

RegisterNetEvent('removeBlipMarkCliente')
AddEventHandler('removeBlipMarkCliente', function(blip)
	local targetX = tonumber(blip.x)
	local targetY = tonumber(blip.y)
	local targetZ = tonumber(blip.z)

	for i, blipData in ipairs(blips) do

		if blipData.x == targetX and blipData.y == targetY and blipData.z == targetZ then
			print("removendo blip")
			RemoveBlip(blipData.blip)
			table.remove(blips, i)
			break
		end
	end
end)

RegisterNetEvent('listBlipMarksCliente')
AddEventHandler('listBlipMarksCliente', function(coords, first_spawn, refresh)
	if first_spawn or refresh then
		for k, v in pairs(coords) do
			if v.tipo == 1 then
				blip = AddBlipForCoord(parseFloat(v.x), parseFloat(v.y), parseFloat(v.z))
				SetBlipSprite(blip, v.icon)
				SetBlipCategory(blip, 9)
				AddTextEntry('MYBLIP', v.name)
				BeginTextCommandSetBlipName('MYBLIP')
				EndTextCommandSetBlipName(blip)
				SetBlipAsShortRange(blip,true) 
				SetBlipScale(
					blip,
					0.6
				)
				table.insert(blips, { blip = blip, x = parseFloat(v.x), y = parseFloat(v.y), z = parseFloat(v.z) })
			end
		end
	else
		blip = AddBlipForCoord(parseFloat(coords[1].x), parseFloat(coords[1].y), parseFloat(coords[1].z))
		SetBlipSprite(blip, coords[1].icon)
		SetBlipCategory(blip, 9)
		AddTextEntry('MYBLIP', coords[1].name)
		BeginTextCommandSetBlipName('MYBLIP')
		EndTextCommandSetBlipName(blip)
		SetBlipAsShortRange(blip,true)
		SetBlipScale(
			blip,
			0.6
		)
		table.insert(blips,
			{ blip = blip, x = parseFloat(coords[1].x), y = parseFloat(coords[1].y), z = parseFloat(coords[1].z) })
	end
end)




