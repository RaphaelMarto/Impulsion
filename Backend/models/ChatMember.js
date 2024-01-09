module.exports = (sequelize, DataTypes) => {
    const ChatMember = sequelize.define("ChatMember", {
      idChatRoom: {
        type: DataTypes.INTEGER,
        unique: 'Unique_ChatMember_User'
      },
      idUser: {
        type: DataTypes.INTEGER,
        unique: 'Unique_ChatMember_User'
      },
    });
  
    ChatMember.associate = (models) => {
        ChatMember.belongsTo(models.ChatRoom, { foreignKey: "idChatRoom" });
        ChatMember.belongsTo(models.User, { foreignKey: "idUser" });
    };
  
    return ChatMember;
  };
  