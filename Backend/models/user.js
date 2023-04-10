module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("User", {
        Surname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        City: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Role: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Avatar: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        PolicyCheck: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    })

    return User;
}