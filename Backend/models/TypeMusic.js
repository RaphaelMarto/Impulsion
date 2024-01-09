module.exports = (sequelize, DataTypes) => {

    const TypeMusic = sequelize.define("TypeMusic", {
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    return TypeMusic;
}