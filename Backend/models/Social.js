module.exports = (sequelize, DataTypes) => {

    const Social = sequelize.define("Social", {
        Spotify: {
            type: DataTypes.STRING,
        },
        Youtube: {
            type: DataTypes.STRING,
        },
        Facebook: {
            type: DataTypes.STRING,
        },
        Soundcloud: {
            type: DataTypes.STRING,
        },
    })

    return Social;
}