module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    Nickname: {
      type: DataTypes.STRING,
    },
    Email: {
      type: DataTypes.STRING,
    },
    Password: {
      type: DataTypes.STRING,
    },
    Phone: {
      type: DataTypes.STRING,
    },
    PictureUrl: {
      type: DataTypes.STRING,
    },
    PolicyCheck: {
      type: DataTypes.BOOLEAN,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    idSocials: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AdressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UID:{
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.Social, { foreignKey: 'idSocials' });
    User.belongsTo(models.Address, { foreignKey: 'AdressId' });
  };

  return User;
};
