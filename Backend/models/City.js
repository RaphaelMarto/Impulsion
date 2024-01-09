module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define("City", {
    Name: {
      type: DataTypes.STRING,
    },
    CountryId: {
      type: DataTypes.INTEGER,
    },
  });

  City.associate = (models) => {
    City.belongsTo(models.Country, { foreignKey: "CountryId" });
  };

  return City;
};
