module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define("ChatRoom", {
        isPublic: {
        type: DataTypes.BOOLEAN,
      },
    });
  
    return ChatRoom;
  };
  