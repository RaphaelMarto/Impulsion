module.exports = (sequelize, DataTypes) => {

    const Comment = sequelize.define("Comment", {
        idMusic: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        RepliedToComId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Message: {
            type: DataTypes.STRING,
        },
    })

    Comment.associate = (models) => {
        Comment.belongsTo(models.Music, { foreignKey: 'idMusic' });
        Comment.belongsTo(models.User, { foreignKey: 'idUser' });
        Comment.belongsTo(models.Comment, { foreignKey: 'RepliedToComId' });
      };

    return Comment;
}