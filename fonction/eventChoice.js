const fonctionJs = require("./fonctionJs");
const eventBdd = require("../bdd/pokemonEvent.json");
const nbEvent = eventBdd.length;



/**
  * resort un objet "event" aléatoire
  */

 function eventSelect(typeEvent){
    let randomIdEvent
    let bool = true;
    while(bool){
        randomIdEvent = fonctionJs.getRandomInt(nbEvent);
        if(eventBdd[randomIdEvent]["quand"] === typeEvent){
            bool = false;
        }
    }

    return(eventBdd[randomIdEvent])
}


function activeEvent(event, Discord){
    switch(event["type"]){
        case "justEmbed":
            
            return(eventJustEmbed(event, Discord));
            break;


    }
}

function eventJustEmbed(event, Discord ){

    var adressImage = "./src/image/pokeHome/"+event["image"]+".png";
    var nameImage = event["image"] + ".png";
    
    let pokeImg = new AttachmentBuilder(adressImage)

    let eventEmbed = new Discord.EmbedBuilder()
        .setColor(event["color"])
        .setTitle()
        .setDescription()
        .setImage("attachment://"+nameImage)
    return(eventEmbed)
}

