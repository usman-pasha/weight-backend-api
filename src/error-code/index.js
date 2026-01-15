import fs from 'fs';
import path from 'path';

const global = JSON.parse(fs.readFileSync(path.resolve('./src/error-code/global.json'), 'utf-8'));
const auth = JSON.parse(fs.readFileSync(path.resolve('./src/error-code/auth.json'), 'utf-8'));
const encryt = JSON.parse(fs.readFileSync(path.resolve('./src/error-code/encryt.json'), 'utf-8'));

export default {
  global,
  auth,
  encryt
};
