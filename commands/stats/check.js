const Discord = require('discord.js');
const config = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'check',
    aliases: ['c', 'stats'],
	description: 'Gets metrics about a player',
	execute(message, args) {
        if(message.channel.type === 'dm' && !args[0]){
			return message.channel.send(
				new Discord.MessageEmbed()
				.setDescription(`To use this in DMs you need to specify a player`)
				.setColor('DC143C')
			)
		} else if(!args[0]){
			var ign = message.member.displayName;
		} else {
			var ign = args[0];
		} // Gets IGN

		message.channel.send(`IGN: ${ign}`);

		fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
    	.then(res => {
        	if(res.status != 200){
				return message.channel.send(
					new Discord.MessageEmbed()
					.setDescription(`No Minecraft account found for \`${ign}\``)
					.setColor('DC143C')
				)
			}
    	}); // Test if IGN esists

		// At this point we know its a valid IGN, but not if it has skyblock profiles
		var apiData = await getApiData(ign); // Gets all skyblock player data from Senither's Hypixel API Facade

		if(apiData.status == 404) return message.channel.send(
			new Discord.MessageEmbed()
			.setDescription(`No Skyblock profile found for \`${ign}\``)
			.setColor('DC143C')
		)

		// IGN is valid and player has skyblock profiles
	},
};

async function getUUID(ign){
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    const result = await response.json();
    const uuid = result.id;
    return uuid.substr(0,8)+"-"+uuid.substr(8,4)+"-"+uuid.substr(12,4)+"-"+uuid.substr(16,4)+"-"+uuid.substr(20);
}

async function getApiData(ign) {
	const UUID = await getUUID(ign);
	const response = await fetch(`https://hypixel-api.senither.com/v1/profiles/${UUID}/save?key=${config.discord.apiKey}`);
	return await response.json();
}