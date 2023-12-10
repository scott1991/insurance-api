import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import configs from '../config/config.json' assert { type: 'json' };
import { fileURLToPath } from 'url';

const env = process.env.NODE_ENV || 'development';
const config = configs[env];
const basename = path.basename(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.loadModels = async () => {
  const modelFiles = fs.readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    });

  const modelImports = modelFiles.map(file => import(path.join(__dirname, file)));
  const importedModules = await Promise.all(modelImports);

  importedModules.forEach(modelDefiner => {
    const model = modelDefiner.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};



db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;