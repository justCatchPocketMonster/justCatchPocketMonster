import { GuildMember } from 'discord.js';
import logger from "../middlewares/error"

export default (Member: GuildMember) => {
    try{
        Member.roles.add([
            "1100421461379907664",
            "906180960150749215",
            "1101131446900506705",
            "1101117276259876974",
            "1153665494935666811"
        ])

        
        
    } catch(e) {
        logger.error(e)
    }
}