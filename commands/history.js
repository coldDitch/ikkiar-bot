const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message, DiscordAPIError } = require('discord.js');
const { getMatchHistoryData } = require('../utils/matchhistorytools');

const findWinnerText = (teams) => {
	var wonTeam = ''

	teams.forEach(team => {
		if(team.win){
			wonTeam = team.teamId === 100 ? 'Blue win' : 'Red win'
		}
	})
	return wonTeam
}

const findTeamColorText = (teams) => {
	if(team.teamId === 100){
		return 'Blue'
	}
	else{
		return 'Red'
	}
}

const fixLength = (word, n) => {
	while(word.toString().length < n){
		word += " "
	}
	return word
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('show ikkiar match history'),

	async execute(interaction) {
		await interaction.reply('🐒🎮')

		matches = await getMatchHistoryData()
				let matchCount = 0;
				const handleRunning = async () => {
					await matches.forEach(async (match, idx) => {
						matchCount += 1
						const temp = JSON.stringify(match)
						const m = JSON.parse(temp)
						//console.log(Object.keys(m))

						const game = m.gameData
						//console.log(game)

						const mid = game.metadata.matchId
						const created = game.gameCreation
						const duration = game.gameDuration
						const teams = game.teams
						const summoners = game.summoners
						//console.log(mid, created, duration, teams, summoners)

						let summonersTexts = ''

						let blueTexts = ''
						let redTexts = ''

						
						// SUMMONE TEXTS
						summoners.forEach((summoner, idx) => {

							let summonerText = ''
							let summonerName = ''
							
						
							
							let champion = summoner.championName + ''

							// SECOND LINE
							let kda = '💀KDA:'
							let dmg = '⚔️Dmg:'
							let gold = '💹Gold:'
							let vision = '🎆Vision:'

							let paddedk = fixLength(kda, 10)
							let paddedd = fixLength(dmg, 10)
							let paddedg = fixLength(gold, 10)
							let paddedv = fixLength(vision, 10)

							let kdavalue = summoner.kills + ' / ' + summoner.deaths + ' / ' + summoner.assists
							let dmgvalue = summoner.totalDamageDealtToChampions
							let goldvalue = summoner.goldEarned
							let visionvalue = summoner.visionScore

							let paddedkda = fixLength(kdavalue, 15)
							let paddeddmg = fixLength(dmgvalue, 15)
							let paddedgold = fixLength(goldvalue, 15)
							let paddedvision = fixLength(visionvalue, 15)

							let k = paddedk + paddedkda + ""
							let d = paddedd + paddeddmg
							let g = paddedg + paddedgold + ""
							let v = paddedv + paddedvision

							let summonerLine2 = "```css\n" + k + "\n" + d + "\n" + g + "\n" + v + "\n```"

							if(summoner.teamId === 100){
								summonerName = `\`\`\`ini\n👤[${summoner.summonerName}] `
								let paddedName = fixLength(summonerName, 17)
								let summonerLine1 = paddedName + champion + '\n```'
								blueTexts += summonerLine1 + summonerLine2
							}
							if(summoner.teamId === 200){
								summonerName = `\`\`\`scss\n👤[${summoner.summonerName}] `
								let paddedName = fixLength(summonerName, 17)
								let summonerLine1 = paddedName + champion + '\n```'
								redTexts += summonerLine1 + summonerLine2
							}
						})

						let dateObj = new Date(created)
						var month = dateObj.getMonth() + 1; //months from 1-12
						var day = dateObj.getDate();
						var year = dateObj.getFullYear();

						newdate =     day + '/' 
									+ month + '/' 
									+ year 


						const historyEmbed = new MessageEmbed()
						.setColor('#38b259')
						.setTitle(newdate.toString())
						.setDescription(findWinnerText(teams) + '\n match id: [' + mid + ']')
						.addFields(
							{ name: 'Blue Team', value: blueTexts, inline: true },	
							{ name: 'Red Team', value: redTexts, inline: true },)

						await interaction.followUp({ embeds: [historyEmbed] }).then(msg =>{
							setTimeout(async () => {
								await msg.delete()
							}, 110000)
						})
					})
					
					setTimeout(async () => {
						await handleRunning()
					}, 120000)
				}		
				
				await handleRunning()
	},
};