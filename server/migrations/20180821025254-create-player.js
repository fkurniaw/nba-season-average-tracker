'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      personId: {
        type: Sequelize.STRING
      },
      teamId: {
        type: Sequelize.STRING
      },
      jersey: {
        type: Sequelize.INTEGER
      },
      pos: {
        type: Sequelize.STRING
      },
      heightMeters: {
        type: Sequelize.FLOAT
      },
      weightPounds: {
        type: Sequelize.INTEGER
      },
      dateOfBirthUTC: {
        type: Sequelize.STRING
      },
      draft: {
        type: Sequelize.JSON
      },
      nbaDebutYear: {
        type: Sequelize.INTEGER
      },
      yearsPro: {
        type: Sequelize.INTEGER
      },
      collegeName: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Players');
  }
};