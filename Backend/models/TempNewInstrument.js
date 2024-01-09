module.exports = (sequelize, DataTypes) => {
    const TempNewInstrument = sequelize.define("TempNewInstrument", {
      Name: {
        type: DataTypes.STRING,
      },
    });
  
    return TempNewInstrument;
  };
  