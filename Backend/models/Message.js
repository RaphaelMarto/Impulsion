module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
      Message: {
        type: DataTypes.STRING,
      },
      SenderId: {
        type: DataTypes.INTEGER,
      },
      ChatRoomId: {
        type: DataTypes.INTEGER,
      },
    });
  
    Message.associate = (models) => {
        Message.belongsTo(models.User, { foreignKey: "SenderId" });
        Message.belongsTo(models.ChatRoom, { foreignKey: "ChatRoomId" });
    };
  
    return Message;
  };
  