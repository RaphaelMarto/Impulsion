module.exports = (sequelize, DataTypes) => {
  const Music = sequelize.define("Music", {
    FilePath: {
      type: DataTypes.STRING(999),
    },
    Name: {
      type: DataTypes.STRING,
    },
    Description: {
      type: DataTypes.STRING,
    },
    TypeMusicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Music.associate = (models) => {
    Music.belongsTo(models.TypeMusic, { foreignKey: "TypeMusicId" });
    Music.belongsTo(models.User, { foreignKey: "idUser" });
  };

  return Music;
};
