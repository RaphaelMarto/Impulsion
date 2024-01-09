module.exports = (sequelize, DataTypes) => {

    const Country = sequelize.define("Country", {
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    return Country;
}