local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")

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
AddEventHandler('spawnarvehicle',function(name)
	local mhash = GetHashKey(name)
	while not HasModelLoaded(mhash) do
		RequestModel(mhash)
		Citizen.Wait(10)
	end

	if HasModelLoaded(mhash) then
		local ped = PlayerPedId()
		local nveh = CreateVehicle(mhash,GetEntityCoords(ped),GetEntityHeading(ped),true,false)

		NetworkRegisterEntityAsNetworked(nveh)
		while not NetworkGetEntityIsNetworked(nveh) do
			NetworkRegisterEntityAsNetworked(nveh)
			Citizen.Wait(1)
		end

		SetVehicleOnGroundProperly(nveh)
		SetVehicleAsNoLongerNeeded(nveh)
		SetVehicleIsStolen(nveh,false)
		SetPedIntoVehicle(ped,nveh,-1)
		SetVehicleNeedsToBeHotwired(nveh,false)
		SetEntityInvincible(nveh,false)
		SetVehicleNumberPlateText(nveh,vRP.getRegistrationNumber())
		Citizen.InvokeNative(0xAD738C3085FE7E11,nveh,true,true)
		SetVehicleHasBeenOwnedByPlayer(nveh,true)
		SetVehRadioStation(nveh,"OFF")

		SetModelAsNoLongerNeeded(mhash)

        TriggerServerEvent("notifyServer", true, "Um veículo foi gerado para você usar, aproveite.")
	end
end)


