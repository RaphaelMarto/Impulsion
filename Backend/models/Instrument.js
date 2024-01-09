module.exports = (sequelize, DataTypes) => {
  const Instrument = sequelize.define("Instrument", {
    Name: {
      type: DataTypes.STRING,
    },
  });

  return Instrument;
};
