import {ChatInputCommandInteraction, ColorResolvable, EmbedBuilder} from "discord.js";
import {Stat} from "../../core/classes/Stat";
import { paginationMenu } from "../other/paginationMenu";
import {SortedResult} from "../../core/classes/SaveAllPokemon";
import allPokemon from '../../data/pokemon.json';
import {ServerType} from "../../core/types/ServerType";
import langue from "../../commands/admin/langue";
import language from "../../lang/language";

export default function createPaginationStat(interaction: ChatInputCommandInteraction, actualVersionStat: Stat, generalVersionStat: Stat, server: ServerType) {
    const ascColor = "32CD32" as ColorResolvable;
    const descColor = "B22222" as ColorResolvable;

    const getLang = (key: string) => language(key, server.language);

    const createSectionHeader = (title: string) => ({
        page: null,
        image: null,
        information: {
            nameSelection: `------${title}------`,
            descriptionSelection: ""
        }
    });

    const createEntry = (title: string, page: any) => ({
        page,
        image: null,
        information: {
            nameSelection: title,
            descriptionSelection: ""
        }
    });

    const createStatEntries = (
        rarityOrForm: string,
        labelKey: string,
        type: 'rarity' | 'form'
    ) => {
        const title = getLang(labelKey);

        const getCatches = (asc: boolean) => {
            return type === 'rarity'
                ? actualVersionStat.getTopCatchedPokemonByRarity(rarityOrForm, false, asc)
                : actualVersionStat.getTopCatchedPokemonByForm(rarityOrForm, false, asc);
        };

        const getSpawns = (asc: boolean) => {
            return type === 'rarity'
                ? actualVersionStat.getTopSpawnedPokemonByRarity(rarityOrForm, false, asc)
                : actualVersionStat.getTopSpawnedPokemonByForm(rarityOrForm, false, asc);
        };

        return [
            createEntry("🔼 " + getLang("statTopCatches") + " " + title,
                embedClassement(getCatches(true), server, getLang("statTopCatches") + " " + title, ascColor)),
            createEntry("🔽 " + getLang("statTopCatches") + " " + title,
                embedClassement(getCatches(false), server, getLang("statTopCatches") + " " + title, descColor)),
            createEntry("🔼 " + getLang("statTopSpawns") + " " + title,
                embedClassement(getSpawns(true), server, getLang("statTopSpawns") + " " + title, ascColor)),
            createEntry("🔽 " + getLang("statTopSpawns") + " " + title,
                embedClassement(getSpawns(false), server, getLang("statTopSpawns") + " " + title, descColor)),
        ];
    };

    const arrayEmbed = [
        createEntry(getLang("statMainPageName"), principalEmbedStat(interaction)),

        createSectionHeader(getLang("statCategoryOrdinary")),
        ...createStatEntries("ordinary", "statCategoryOrdinary", "rarity"),

        createSectionHeader(getLang("statCategoryLegendary")),
        ...createStatEntries("legendary", "statCategoryLegendary", "rarity"),

        createSectionHeader(getLang("statCategoryMythical")),
        ...createStatEntries("mythical", "statCategoryMythical", "rarity"),

        createSectionHeader(getLang("statCategoryMega")),
        ...createStatEntries("mega", "statCategoryMega", "form")
    ];

    paginationMenu(interaction,getLang("selectAPage"), arrayEmbed)

}

function embedClassement(
    arraySortPokemon: SortedResult[],
    server: ServerType,
    title: string,
    color: ColorResolvable
) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color);

    const langKey = `name${server.language}` as "nameEng" | "nameFr";

    arraySortPokemon.slice(0, 21).forEach((statPokemon, index) => {
        const displayedPokemons = statPokemon.who
            .slice(0, 3)
            .map(id => {
                const pokemon = allPokemon.find(p => p.id.toString() === id);
                return pokemon ? pokemon.name[langKey].join(" ") : null;
            })
            .filter(Boolean)
            .join(" ");

        const remainingCount = statPokemon.who.length - 3;
        const suffix = remainingCount > 0 ? `... (+ ${remainingCount} autres)` : "";

        embed.addFields({
            name: `${index + 1}. ${statPokemon.maxCount}`,
            value: displayedPokemons + (suffix ? ` ${suffix}` : ""),
            inline: true
        });
    });

    return embed;
}




function principalEmbedStat(interaction){
        mostLeastCatch = stringObjectPokemonMostAndLeastCatch(interaction);
        mostLeastSpawn = stringObjectPokemonMostAndLeastSpawn(interaction);



        let statEmbed = new Discord.EmbedBuilder()
            .setTitle("stats")
            .setColor("Purple")
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeCaptureTotaly"), value: getCount(false, false, false)+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyTotaly"), value: getCount(false, false, true)+"", inline:true}
            )
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeSpawnTotaly"), value: getCount(false, true, false)+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyTotaly"), value:getCount(false, true, true)+"", inline:true}
            )
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeCaptureVersion"), value: getCount(false, false, false, "version")+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeCaptureShinyVersion"), value: getCount(false, false, true, "version")+"", inline:true}
            )
            .addFields(
                {name: language.getText(interaction.guild.id, "nombreDeSpawnVersion"), value: getCount(false, true, false, "version")+"", inline:true},
                {name: language.getText(interaction.guild.id, "nombreDeSpawnShinyVersion"), value: getCount(false, true, true, "version")+"", inline:true}
            )
            .addFields(
                {name: language.getText(interaction.guild.id, "pokemonLeastCaught"), value: mostLeastCatch["least"], inline:true},
                {name: language.getText(interaction.guild.id, "pokemonMostCaught"), value: mostLeastCatch["most"], inline:true}
            )
            .addFields(
                {name: language.getText(interaction.guild.id, "pokemonLeastSpawn"), value: mostLeastSpawn["least"], inline:true},
                {name: language.getText(interaction.guild.id, "pokemonMostSpawn"), value: mostLeastSpawn["most"], inline:true}
            )

        return statEmbed;
    }



interface pokemon {
    id: number
    name: {
        [key: string]: string[];
    }
    arrayType: string[]
    rarity: string
    gen: number
    imgName: string
    form: string
    versionForm: number
}
