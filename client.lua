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
				blip = AddBlipForCoord(tonumber(v.x), tonumber(v.y), tonumber(v.z))
				SetBlipSprite(blip, v.icon)
				SetBlipCategory(blip, 9)
				AddTextEntry('MYBLIP', v.name)
				BeginTextCommandSetBlipName('MYBLIP')
				EndTextCommandSetBlipName(blip)
				SetBlipAsShortRange(blip, true)
				SetBlipScale(
					blip,
					0.6
				)
				table.insert(blips, { blip = blip, x = tonumber(v.x), y = tonumber(v.y), z = tonumber(v.z) })
			end
		end
	else
		blip = AddBlipForCoord(tonumber(coords[1].x), tonumber(coords[1].y), tonumber(coords[1].z))
		SetBlipSprite(blip, coords[1].icon)
		SetBlipCategory(blip, 9)
		AddTextEntry('MYBLIP', coords[1].name)
		BeginTextCommandSetBlipName('MYBLIP')
		EndTextCommandSetBlipName(blip)
		SetBlipAsShortRange(blip, true)
		SetBlipScale(
			blip,
			0.6
		)
		table.insert(blips,
			{ blip = blip, x = tonumber(coords[1].x), y = tonumber(coords[1].y), z = tonumber(coords[1].z) })
	end
end)


RegisterNetEvent('tptoway')
AddEventHandler('tptoway',function()
	local ped = PlayerPedId()
	local veh = GetVehiclePedIsUsing(ped)
	if IsPedInAnyVehicle(ped) then
		ped = veh
    end

	local waypointBlip = GetFirstBlipInfoId(8)
	local x,y,z = table.unpack(Citizen.InvokeNative(0xFA7C7F0AADF25D09,waypointBlip,Citizen.ResultAsVector()))

	local ground
	local groundFound = false
	local groundCheckHeights = { 0.0,50.0,100.0,150.0,200.0,250.0,300.0,350.0,400.0,450.0,500.0,550.0,600.0,650.0,700.0,750.0,800.0,850.0,900.0,950.0,1000.0,1050.0,1100.0 }

	for i,height in ipairs(groundCheckHeights) do
		SetEntityCoordsNoOffset(ped,x,y,height,0,0,1)

		RequestCollisionAtCoord(x,y,z)
		while not HasCollisionLoadedAroundEntity(ped) do
			RequestCollisionAtCoord(x,y,z)
			Citizen.Wait(1)
		end
		Citizen.Wait(20)

		ground,z = GetGroundZFor_3dCoord(x,y,height)
		if ground then
			z = z + 1.0
			groundFound = true
			break;
		end
	end

	if not groundFound then
		z = 1200
		GiveDelayedWeaponToPed(PlayerPedId(),0xFBAB5776,1,0)
	end

	RequestCollisionAtCoord(x,y,z)
	while not HasCollisionLoadedAroundEntity(ped) do
		RequestCollisionAtCoord(x,y,z)
		Citizen.Wait(1)
	end

	SetEntityCoordsNoOffset(ped,x,y,z,0,0,1)
end)



Citizen.CreateThread(function()
    Citizen.Wait(1000) -- Aguarda 1 segundo
    TriggerServerEvent('salario:pagamentoLoop')
end)
