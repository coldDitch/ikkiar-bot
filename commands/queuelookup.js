const { SlashCommandBuilder } = require('@discordjs/builders');

// MONGO
//const User = require('../models/user')
const Queuer = require('../models/queuer')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queuelookup')
		.setDescription('Check who is in queue'),


	async execute(interaction) {
        const queuers = await Queuer.find({})
		let top = 0; let jungle = 0; let mid = 0; let adc = 0; let support = 0;

		queuers.forEach(summoner => {

			if(summoner.role === 'top'){
				top += 1
			}
			if(summoner.role === 'jungle'){
				jungle += 1
			}
			if(summoner.role === 'mid'){
				mid += 1
			}
			if(summoner.role === 'adc'){
				adc += 1
			}
			if(summoner.role === 'support'){
				support += 1
			}
		})

        console.log(queuers)

		await interaction.reply(
			"```" + "ini\n" + "[" + queuers.length + " Summoners in queue] \n \n" + "🦏 top: " + top +" 🦥 jungle: " + jungle + " 🧙 mid: " + mid + " 🏹 ad: " + adc +" 🐈 sup: " + support + "```"
		);
	},
};