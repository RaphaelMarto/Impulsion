module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
      Street: {
        type: DataTypes.STRING,
      },
      HouseNum: {
        type: DataTypes.INTEGER,
      },
      PostCode: {
        type: DataTypes.INTEGER,
      },
      CityId: {
        type: DataTypes.INTEGER,
      },
    });
  
    Address.associate = (models) => {
        Address.belongsTo(models.City, { foreignKey: "CityId" });
    };
  
    return Address;
  };
  