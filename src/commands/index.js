const fs = require("fs")
const path = require("path")

module.exports = client => {
    const foldersPath = path.join(__dirname)
    const commandFolders = fs.readdirSync(foldersPath)
    
    for (const folder of commandFolders) {

        const commandsPath = path.join(foldersPath, folder)

        if (fs.statSync(commandsPath).isDirectory()) {

            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
            
            for (const file of commandFiles) {
                let filePath = path.join(commandsPath, file)
                let command = require(filePath)
                command.category = folder
                client.commands.set(command.name, command)
            }

        }
        
    }
}