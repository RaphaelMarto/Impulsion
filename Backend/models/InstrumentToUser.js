module.exports = (sequelize, DataTypes) => {

    const InstrumentToUser = sequelize.define("InstrumentToUser", {
        InstrumentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Unique_User_Instrument',
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Unique_User_Instrument',
        },
    })

    InstrumentToUser.associate = (models) => {
        InstrumentToUser.belongsTo(models.Instrument, { foreignKey: 'InstrumentId' });
        InstrumentToUser.belongsTo(models.User, { foreignKey: 'UserId' });
      };

    return InstrumentToUser;
}