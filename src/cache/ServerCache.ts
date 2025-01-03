// @ts-ignore
import NodeCache from 'node-cache';
import Server from '../models/Server';
import ServerType from '../types/ServerType';
import EventSpawn from "../models/EventSpawn";
import EventSpawnType from "../types/EventSpawnType";
import allPokemon from '../data/pokemon.json';
import PokemonType from "../types/PokemonType";
import SaveOnePokemon from "../models/SaveOnePokemon";
import SaveOnePokemonType from "../types/SaveOnePokemonType";
import {ttlAllData} from "../defaultValue";
import { ObjectId } from 'mongodb';


const serverCache = new NodeCache({ stdTTL: ttlAllData, checkperiod: 10 });

const getServer = async (id: string): Promise<ServerType> => {
    let serverFromCache:ServerType | undefined = serverCache.get<ServerType>(id);

    if (serverFromCache === undefined || serverFromCache === null) {
        let server = await verificationServerComplet(id);

        serverCache.set(id, prepareForCache(server));
        serverFromCache = serverCache.get<ServerType>(id);
    }

    if (serverFromCache === undefined) {
        throw new Error("serverString est undefined, impossible de parser.");
    }
    return serverFromCache;
};

function prepareForCache(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (key, value) => {
            if (value instanceof ObjectId) return value.toString();
            if (value instanceof Date) return value.toISOString();
            return value;
        })
    );
}


const updateServer = (id: string, data: ServerType) => {
    try {
        serverCache.set(id, data);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du serveur :', error);
    }
};
// Écouteur de l'événement 'expired' pour traiter les données lorsque leur TTL expire
// @ts-ignore
serverCache.on('expired', async (key: String, value: ServerType) => {

    try {
        const server : ServerType = value;
        for (const pokemonSave of server.savePokemon) {
            await SaveOnePokemon.updateOne({ _id: pokemonSave._id }, pokemonSave, { upsert: true });
        }

        await EventSpawn.updateOne({ _id: server.eventSpawn._id }, server.eventSpawn, { upsert: true });

        await Server.updateOne({ id: server.id }, server, { upsert: true });

        console.log(`Serveur ${server.id} traité et sauvegardé.`);
    } catch (error) {
        console.error('Erreur lors du traitement des données expirées :', error);
    }
});

export { getServer, updateServer };

const verificationServerComplet = async (id : string) : Promise<typeof Server> => {
    let server = await Server.findOne({ id });

    if (!server) {

        server = new Server({
            id,
            eventSpawn: (await createEventSpawn(id))._id});
        await Server.updateOne({ id }, server, { upsert: true });
    }

    if(server.eventSpawn == null) {
        server.eventSpawn = (await createEventSpawn(id));
    }
    server = await Server.findOne({ id }).populate('eventSpawn').populate("savePokemon").exec();

    // @ts-ignore
    return server;
}

const createEventSpawn = async (idServer : string) => {
    const eventSpawn = new EventSpawn();
    await EventSpawn.updateOne({ _id: eventSpawn._id }, eventSpawn, { upsert: true });

    Server.updateOne({ id: idServer }, { $push: { eventSpawn: eventSpawn._id } });
    return eventSpawn;
}

const updatePokemonSave = async (savePokemon : SaveOnePokemonType[] = [], idServer : string) => {

    let arraySavePromise = []
    let element;
    for(let i = 0; i < 1; i++) {
        for (const pokemon of allPokemon) {
            let actualSave
            const pokemonPresent = savePokemon.filter(pokemonSave =>
                pokemonSave.idPokemon === pokemon.id
                && pokemonSave.form === pokemon.form)
            if (pokemonPresent.length === 0 && pokemon.id !== 0) {
                actualSave = new SaveOnePokemon({
                    idPokemon: pokemon.id,
                    form: pokemon.form,
                    versionForm: pokemon.versionForm,
                    catch: 0,
                    shiny: 0
                })
                element = SaveOnePokemon.create(actualSave)
                arraySavePromise.push(
                    element
                )
            }
            console.log(i, pokemon.id)
        }
    }
    // @ts-ignore
    Promise.all(arraySavePromise).then((values) => {
        console.log(values.length);
    });


    //console.log(arrayIdSave)
    //await Server.updateOne({ id: idServer }, { savePokemon: { $each: arrayIdSave } });
    //await Server.updateOne({ id: idServer }, { $push: { savePokemon: { $each: arrayIdSave } }});
    console.log("ok")
    return savePokemon;

}