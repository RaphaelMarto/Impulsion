module.exports = (sequelize, DataTypes) => {

    const Music = sequelize.define("Music", {
        File: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        SongName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Desc: {
            type: DataTypes.STRING,
            allowNull: true
        },
    })

    Music.associate = (models) => {
        Music.belongsTo(models.User, { foreignKey: 'IdUser' });
        models.User.hasMany(Music, { foreignKey: 'IdUser' }); 
    }

    return Music;
}