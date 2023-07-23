
-- ADICIONE O CÓDIGO ABAIXO NO ARQUIVO /vrp/client/garages.lua
function VehicleGlobal()
    return List
end

-- ADICIONE O CÓDIGO ABAIXO NO ARQUIVO /vrp/lib/itemlist.lua
function itemList()
	return List
end


-- ADICIONE O CÓDIGO ABAIXO NO ARQUIVO /vrp/modules/prepare.lua
vRP.Prepare("redstore/get_groups",
  "SELECT RG.nome AS 'grupo', RGH.nome AS 'cargo' FROM redstore_groups_user AS RGU JOIN redstore_groups_hierarquia AS RGH JOIN redstore_groups AS RG ON RGU.idHierarquia = RGH.id AND RG.id = RGH.id_group WHERE RGU.idUser = @user_id")


-- ADICIONE O CÓDIGO ABAIXO NO ARQUIVO /vrp/modules/inventory.lua

function vRP.itemListRedStore()
	return itemList()
end

-- VERIFICAR SE NÃO JÁ POSSUI UMA FUNCIONALIDE DE LIMPAR O INVENTÁRIO, CASO JÁ TENHA ADAPTE PARA ESSA FUNCIONALIDE ABAIXO.

function vRP.ClearInventory(Passport)
    local source = vRP.Source(Passport)
    local Datatable = vRP.Datatable(Passport)
    if source and Datatable and Datatable.Inventory then
        exports.inventory:CleanWeapons(parseInt(Passport), true)
        TriggerEvent("DebugObjects", parseInt(Passport))
        TriggerEvent("DebugWeapons", parseInt(Passport))
        Datatable.Inventory = {}
    end
end


-- ADICIONE O CÓDIGO ABAIXO NO ARQUIVO /vrp/modules/vehicles.lua
function vRP.vehicleListRedStore()
	return VehicleGlobal()
end


-- MODIFICAR A FUNCIONALIDADE EXISTENTEM NO /vrp/modules/group.lua


-- ESSA É A NOVA FUNCIONALIDADE DE VERIFICAR O CARGO E A HERARQUIA DO JOGADOR. 
-- O NOME DA FUNCIONALIDADE VOCÊ PODE USAR A QUE JÁ EXISTE NA SUA BASE.
-- LEMBRANDO QUE VOCÊ TERA QUE ADAPTAR A BASE PARA ESSA NOVA FUNCIONALIDADE.

-- EXEMPLO DE COMO ADICIONAR EM UM AQUIVO:  if vRP.hasPerm(Passport, "Administração", "Owner")

-- O PRIMEIRO PARAMÊTRO É O ID DO JOGADOR, O SEGUNDO É O CARGO E O TERCEIRO É A HIERARQUIA.

function vRP.hasPermission(user_id, cargo, hierarquia)
    local groups = vRP.query("redstore/get_groups", { user_id = tonumber(user_id) })
    for k, v in pairs(groups) do
    	local k_cargo = v.grupo
    	local k_hierarquia = v.cargo
      if k_cargo == cargo and k_hierarquia == hierarquia then
        return true
      end
    end
    return false
end






