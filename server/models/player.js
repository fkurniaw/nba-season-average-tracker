'use strict';
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    personId: DataTypes.STRING,
    teamId: DataTypes.STRING,
    jersey: DataTypes.INTEGER,
    pos: DataTypes.STRING,
    heightMeters: DataTypes.FLOAT,
    weightPounds: DataTypes.INTEGER,
    dateOfBirthUTC: DataTypes.STRING,
    draft: DataTypes.JSON,
    nbaDebutYear: DataTypes.INTEGER,
    yearsPro: DataTypes.INTEGER,
    collegeName: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
  Player.associate = models => {
    // associations can be defined here
    Player.belongsTo(models.Year, {
      foreignKey: 'yearId',
      onDelete: 'CASCADE'
    });
  };
  return Player;
};
