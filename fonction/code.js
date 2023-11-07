const codeEntered = require("../bdd/enteredCode.json")
const language = require("../fonction/language")
const pokemonObject = require("../object/PokemonObject")
const savePokemonUser = require("./pokedexSaveUser")
const saveShinyUser = require("./shinydexSaveUser")
const codeBdd = require("../bdd/code.json")
const fs = require("fs");
const catchError = require("./catchError")
const lockfile = require('lockfile');
const path = require('path');
const stat = require("../fonction/stat.js")
const Discord = require("discord.js")

const paliers = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000];

class CodeHandler {

    static async enterCode(idUser, code, interaction){

        try{

            if(codeEntered[idUser] === undefined){
                this.createUser(idUser)
                this.SaveBdd();
            }
            this.codeHasEffect(idUser, code, interaction)
        } catch(e) {

            catchError.saveError(interaction.guild.id, interaction.channel.id, "code.js", "enterCode", e)
            console.error(e)
        }
    }

    static createUser(idUser){
        try{
            codeEntered[idUser] = []
            return
        } catch(e) {

            catchError.saveError(null, null, "code.js", "createUser", e)
            console.error(e)
        }
    }

    static modifierDonneesSpawn(palier, type) {
        try{
            var codesASupprimer = codeBdd.shiny.filter(code => code.includes(type));
            codeBdd.shiny = codeBdd.shiny.filter(code => !codesASupprimer.includes(code));
        

            var nouveauCode = palier + type;
            codeBdd.shiny.push(nouveauCode);
            const lockfilePath = path.join(__dirname,"..", 'lock', 'code.lock');
        
            lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
                if (err) {
                    console.error('Erreur lors du verrouillage du fichier :', err);
                    return;
                }
            fs.writeFile(path.join(__dirname,"..", 'bdd', 'code.json'), JSON.stringify(codeBdd, null, 4), (err)=> {
                if (err)console.log("erreur")

                lockfile.unlock(lockfilePath, (err) => {
                    if (err) {
                        console.error('Erreur lors du déverrouillage du fichier :', err);
                    }
                });
            });
        });
        } catch(e) {

            catchError.saveError(null, null, "code.js", "SaveBdd", e)
            console.error(e)
        }


    }

    static codeListEmbed(idUser, idServer){
        try{
            if(codeEntered[idUser] === undefined){
                this.createUser(idUser)
                this.SaveBdd();
            }
            const embed = new Discord.EmbedBuilder()
            embed.setTitle(language.getText(idServer, "codeListEmbedTitle"))
            embed.setDescription(language.getText(idServer, "codeListEmbedDescription"))
            for(const [key, value] of Object.entries(codeBdd)){
                value.forEach(code => {
                    if(codeEntered[idUser].includes(code)){
                        embed.addFields(
                            { 
                                name: code , 
                                value: ":white_check_mark:", 
                                inline: true
                            },
                        )
                    }else {
                        embed.addFields(
                            { 
                                name: code, 
                                value: ":x:", 
                                inline: true
                            }
                        )
                    }
                })
            }
            return embed
        } catch(e) {

            catchError.saveError(null, null, "code.js", "codeListEmbed", e)
            console.error(e)
        }
    }

    static async codeIsOutdated() {

        statCatch = stat.getCount(false, false, false);
        statSpawn = stat.getCount(false, true, false);

        actualCodeValueSpawn = codeBdd.shiny.filter(code => code.includes("SPAWNS"))[0].split("SPAWNS")[0];
        actualCodeValueCatch = codeBdd.shiny.filter(code => code.includes("CATCHS"))[0].split("CATCHS")[0];

        
        paliers.forEach(palier => {
            if (statSpawn >= palier && actualCodeValueSpawn < palier) {
                this.modifierDonneesSpawn(palier, "SPAWNS");
            }
            if (statCatch >= palier && actualCodeValueCatch < palier) {
                this.modifierDonneesSpawn(palier, "CATCHS");
            }
        });

    }

    static async codeHasEffect (idUser, code, interaction){
        try{

            if(codeBdd["shiny"].includes(code)){
                if(codeEntered[idUser].includes(code)){
                    interaction.channel.send(language.getText(interaction.guild.id, "codeAlreadyUsed"));
                    
                } else {
                    this.effectCode1(idUser, interaction);
                    codeEntered[idUser].push(code);
                }
                this.SaveBdd();
                return
            }


            interaction.channel.send(language.getText(interaction.guild.id, "codeDontExist"));
        } catch(e) {

            catchError.saveError(interaction.guild.id, interaction.channel.id, "code.js", "codeHasEffect", e)
            console.error(e)
        }
    }

    static effectCode1(idUser, interaction){
        try{
            pokemon = pokemonObject.pokemonSelect();

            savePokemonUser.pokedex(pokemon["id"], idUser)
            saveShinyUser.pokedex(pokemon["id"], idUser)
            
            if(interaction.member.nickname != null){
                name = interaction.member.nickname
            } else {
                name = interaction.member.displayName;
            }

            if(pokemon["name"]["nameFr"] != pokemon["name"]["nameEng"]){
                interaction.channel.send(language.getText(interaction.guild.id, "congratYouCatchPart1")+name+language.getText(interaction.guild.id, "congratYouCatchPart2")+ pokemon["name"]["nameFr"] +"/"+ pokemon["name"]["nameEng"]+":star:")
            }else{
                interaction.channel.send(language.getText(interaction.guild.id, "congratYouCatchPart1")+name+language.getText(interaction.guild.id, "congratYouCatchPart2")+ pokemon["name"]["nameFr"]+":star:")
            }

        } catch(e) {

            catchError.saveError(interaction.guild.id, interaction.channel.id, "code.js", "effectCode1", e)
            console.error(e)
        }
    }

    static SaveBdd(){

        const lockfilePath = path.join(__dirname,"..", 'lock', 'enteredCode.lock');

        

        try{
            lockfile.lock(lockfilePath, {"retries": 100, "retryWait": 200}, (err) => {
                if (err) {
                    console.error('Erreur lors du verrouillage du fichier :', err);
                    return;
                }
            fs.writeFile(path.join(__dirname,"..", 'bdd', 'enteredCode.json'), JSON.stringify(codeEntered, null, 4), (err)=> {
                if (err)console.log("erreur")

                lockfile.unlock(lockfilePath, (err) => {
                    if (err) {
                        console.error('Erreur lors du déverrouillage du fichier :', err);
                    }
                });
            });
        });
        } catch(e) {

            catchError.saveError(null, null, "code.js", "SaveBdd", e)
            console.error(e)
        }


    }
}

module.exports = CodeHandler
