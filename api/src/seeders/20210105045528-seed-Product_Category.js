'use strict';

const _Data = require('../data/product_category.json');


module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkInsert('Product_Category', _Data, {});

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
