'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Remove the 'type' column from the 'questions' table
    await queryInterface.removeColumn('questions', 'type');
  },

  async down(queryInterface, Sequelize) {
    // Add the 'type' column back to the 'questions' table
    await queryInterface.addColumn('questions', 'type', {
      type: Sequelize.ENUM('radio', 'checkbox', 'select', 'text'),
      allowNull: false,
    });
  },
};
