const { Client, PacketWriter, State } = require('mcproto')
const { Rcon } = require('rcon-client')
const parseString = require('minecraft-protocol-chat-parser')(735).parseString

class ServerService {
	static async connect() {
		ServerService.rcon = await Rcon.connect({
			host: process.env.RCON_IP,
			port: process.env.RCON_PORT,
			password: process.env.RCON_PASSWORD,
		})

		ServerService.rcon.on('error', () => ServerService.connect())
		ServerService.rcon.on('close', () => ServerService.connect())
	}

	static async getServerInfo(host, port = '25565') {
		const client = await Client.connect(host, port)

		const packet = new PacketWriter(0x0)
			.writeVarInt(404)
			.writeString(host)
			.writeUInt16(port)
			.writeVarInt(State.Status)

		client.send(packet)
		client.send(new PacketWriter(0x0))

		const response = await client.nextPacket(0x0)
		const status = response.readJSON()

		client.end()

		return status
	}

	static async balanceOf(nickname) {
		const balanceString = await ServerService.rcon.send(`balance ${nickname}`)

		const parsedString = parseString(balanceString)
		const rowBalance = parsedString.extra[parsedString.extra.length - 1].text
		const balance = parseFloat(rowBalance.slice(1)) || 0

		return balance
	}

	static async deposit(nickname, amount) {
        await ServerService.rcon.send(`money give ${nickname} ${amount}`)
		console.log('deposit', nickname, amount)
    }

	static async withdraw(nickname, amount) {
        await ServerService.rcon.send(`money take ${nickname} ${amount}`)
		console.log('withdraw', nickname, amount)
    }
}

module.exports = ServerService
