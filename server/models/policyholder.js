import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Policyholder = sequelize.define('Policyholder', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    introducer_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lchild_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rchild_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['code']
      }
    ]
  });

  Policyholder.associate = (models) => {
    Policyholder.belongsTo(models.Policyholder, { as: 'parent', foreignKey: 'parent_id' });
    Policyholder.hasOne(models.Policyholder, { as: 'lchild', foreignKey: 'lchild_id' });
    Policyholder.hasOne(models.Policyholder, { as: 'rchild', foreignKey: 'rchild_id' });
  };

  return Policyholder;
};
