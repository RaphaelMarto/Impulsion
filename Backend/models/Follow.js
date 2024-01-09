module.exports = (sequelize, DataTypes) => {

    const Follow = sequelize.define("Follow", {
        idUserFollowing: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Unique_Follow_User',
        },
        idUserFollowed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'Unique_Follow_User',
        },
    })

    Follow.associate = (models) => {
        Follow.belongsTo(models.User, { foreignKey: 'idUserFollowing' });
        Follow.belongsTo(models.User, { foreignKey: 'idUserFollowed' });
      };

    return Follow;
}