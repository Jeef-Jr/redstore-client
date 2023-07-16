const unzipper = require('unzipper');
const axios = require('axios').default;
const fs = require('fs');

const repository = 'https://github.com/Jeef-Jr/redstore-client/archive/master.zip';
const folder = __dirname+'/../';

const excluded = [
  '/config.json',
];

async function update() {
  const response = await axios.get(repository, {responseType: 'arraybuffer'});
  const zip = await unzipper.Open.buffer(response.data);
  for (let file of zip.files) {
    if (file.path.endsWith('/')) continue;
    let path = file.path.replace('redstore-client-master', '');
    if (path.length && !excluded.includes(path)) {
      const buffer = await file.buffer();
      fs.writeFileSync(folder+path, buffer);
    }
  }
}

update().then(() => console.log('Script atualizado com sucesso')).catch(console.error);