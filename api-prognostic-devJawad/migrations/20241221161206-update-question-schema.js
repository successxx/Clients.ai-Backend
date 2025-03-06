'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change column 'title' to 'question' and update its data type
    await queryInterface.renameColumn('questions', 'title', 'question');
    await queryInterface.changeColumn('questions', 'question', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Modify 'options' column to have a JSON structure with 'text' and 'isCorrect'
    await queryInterface.changeColumn('questions', 'options', {
      type: Sequelize.JSON,
      allowNull: false,
    });

    // Ensure 'creationDate' allows NULL values
    await queryInterface.changeColumn('questions', 'creationDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Update 'quizId' to ensure it references the 'quizzes' table
    await queryInterface.changeColumn('questions', 'quizId', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'quizzes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert 'question' back to 'title' with original type
    await queryInterface.renameColumn('questions', 'question', 'title');
    await queryInterface.changeColumn('questions', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Revert 'options' column to original nullable JSON
    await queryInterface.changeColumn('questions', 'options', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Revert 'creationDate' to not allow NULL
    await queryInterface.changeColumn('questions', 'creationDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    // Revert 'quizId' to its original state
    await queryInterface.changeColumn('questions', 'quizId', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'quizzes',
        key: 'id',
      },
    });
  },
};
