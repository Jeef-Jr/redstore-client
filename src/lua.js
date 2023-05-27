exports.lua = (lua_code) => {
    return new Promise(resolve => {
      emit('redstore-lua', lua_code, resolve);
    });
  }