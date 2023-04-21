const { SlashCommandBuilder, SlashCommandStringOption } = require('discord.js');
require('dotenv').config();
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('current-price')
    .setDescription('Replies with the actual price of the stock')
    .addStringOption(option =>
      option.setName('stock')
        .setDescription('Stock to search')
        .setRequired(true)
    ),
  async execute(interaction) {
    const stock = interaction.options.getString('stock');
    const options = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/price',
      params: { symbol: `${stock}`, format: 'json', outputsize: '30' },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': process.env.API_HOST
      }
    };
    try {
      const response = await axios.request(options);
      const price = await response.data;
      if (price.price) {
        const embed = {
          color: 0x0099ff,
          title: `Stock Price of ${stock}`,
          description: `$ ${price.price}`,
          timestamp: new Date()
        };
        await interaction.reply({ embeds: [embed] });
        return;
      }
      await interaction.reply(`Sorry, could not find the stock ${stock}. Please try again.`);
    } catch (error) {
      console.error(error);
      await interaction.reply(`An error occurred while fetching data for ${stock}.`);
    }
  },
};