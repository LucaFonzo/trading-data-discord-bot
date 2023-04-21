const { SlashCommandBuilder, SlashCommandStringOption } = require('discord.js');
require('dotenv').config();
const axios = require('axios');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Replies with the quote of the time given')
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Time to research')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('stock')
        .setDescription('Stock to search')
        .setRequired(true)
  ),
  async execute(interaction) {
    const stock = interaction.options.getString('stock');
    const time = interaction.options.getString('time');
    const options = {
      method: 'GET',
      url: 'https://twelve-data1.p.rapidapi.com/quote',
      params: { symbol: `${stock}`, interval: `${time}`, outputsize: '30', format: 'json' },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': process.env.API_HOST
      }
    };
    try {
      const response = await axios.request(options);
      const data = await response.data;
      if (data.code != '400') {
        const embed = {
          color:  0x00ff00,
          title: `Quote Price of ${stock}`,
          description: `Symbol: ${data.symbol}
                        Name: ${data.name}
                        Exchange: ${data.exchange}
                        Currency: ${data.currency}
                        Date: ${data.datetime}
                        Open: $ ${data.open}
                        High: $ ${data.high}
                        Low: $ ${data.low}
                        Close: $ ${data.close}
                        Volume: $ ${data.volume}
                        Prev Close: $ ${data.previous_close}
                        Change: ${data.change}
                        Percentage change: ${data.percent_change}
                        Average Volume: ${data.average_volume}
                        Market: ${data.is_market_open ? 'Open': 'Close'}
                        `,
          timestamp: new Date()
        };
        await interaction.reply({ embeds: [embed] });
        return;
      }
      await interaction.reply(`${stock} ${time}`);
    } catch (error) {
      await interaction.reply('Somethins goes wrong');
    }
  }
}