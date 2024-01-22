module.exports = (sequelize, DataTypes) => {

    const Statistic = sequelize.define("Statistic", {
        nbLike: {
            type: DataTypes.INTEGER,
        },
        nbView: {
            type: DataTypes.INTEGER,
        },
        idMusic: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })

    Statistic.associate = (models) => {
        Statistic.belongsTo(models.Music, { foreignKey: 'idMusic' });
      };

    return Statistic;
}