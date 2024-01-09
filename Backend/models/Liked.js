module.exports = (sequelize, DataTypes) => {

    const Liked = sequelize.define("Liked", {
        idMusic: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Unique_Like_User',
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Unique_Like_User',
        },
    })

    Liked.associate = (models) => {
        Liked.belongsTo(models.Music, { foreignKey: 'idMusic' });
        Liked.belongsTo(models.User, { foreignKey: 'UserId' });
      };

    return Liked;
}