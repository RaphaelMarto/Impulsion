module.exports = (sequelize, DataTypes) => {
    const TempNewInstrument = sequelize.define("TempNewInstrument", {
      Name: {
        type: DataTypes.STRING,
      },
      Reference:{
        type: DataTypes.STRING(999),
      },
    });
  
    return TempNewInstrument;
  };
  