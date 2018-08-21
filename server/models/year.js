'use strict';
module.exports = (sequelize, DataTypes) => {
  const Year = sequelize.define('Year', {
    yearNumber: DataTypes.STRING
  }, {});
  Year.associate = function(models) {
    // associations can be defined here
  };
  return Year;
};
