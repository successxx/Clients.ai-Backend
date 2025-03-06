'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_smtp_config', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "company_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      smtpHost: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      smtpPort: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      smtpUser: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      smtpPassword: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      useSSL: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('company_smtp_config');
  },
};
