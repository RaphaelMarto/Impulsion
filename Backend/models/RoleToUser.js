module.exports = (sequelize, DataTypes) => {

    const RoleToUser = sequelize.define("RoleToUser", {
        RoleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'unique_user_role',
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'unique_user_role',
        },
    })

    RoleToUser.associate = (models) => {
        RoleToUser.belongsTo(models.Role, { foreignKey: 'RoleId' });
        RoleToUser.belongsTo(models.User, { foreignKey: 'UserId' });
      };

    return RoleToUser;
}