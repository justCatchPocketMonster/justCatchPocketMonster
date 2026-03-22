import { User } from "../../core/schemas/User";
import allPokemon from "../../data/pokemon.json";
import { random } from "../../utils/helperFunction";

export async function giveRandomPokemonToAllUsers(options?: {
  verbose?: boolean;
}): Promise<{
  updatedCount: number;
  userCount: number;
}> {
  const verbose = options?.verbose === true;
  const users = await User.find({}).lean();
  const userCount = users.length;

  if (verbose) {
    console.log(`Found ${userCount} users`);
  }

  const validPokemon = allPokemon.filter((p) => p.id !== 0);
  let updatedCount = 0;

  for (const user of users) {
    const savePokemon = user.savePokemon?.data || {};

    if (!savePokemon || Object.keys(savePokemon).length === 0) {
      if (verbose) {
        console.log(`Skipping user ${user.discordId} - no pokemon initialized`);
      }
      continue;
    }

    let pokemonAdded = 0;

    for (const pokemon of validPokemon) {
      const pokemonKey = `${pokemon.id}-${pokemon.form}-${pokemon.versionForm}`;

      const setToZero = Math.random() < 0.5;
      let newNormalCount: number;
      let newShinyCount: number;

      if (setToZero) {
        newNormalCount = 0;
        newShinyCount = 0;
      } else {
        const currentPokemon = savePokemon[pokemonKey];
        const normalCount = random(11);
        const shinyCount = random(normalCount + 1);
        newNormalCount = (currentPokemon?.normalCount || 0) + normalCount;
        newShinyCount = (currentPokemon?.shinyCount || 0) + shinyCount;
      }

      savePokemon[pokemonKey] = {
        idPokemon: pokemon.id.toString(),
        rarity: pokemon.rarity,
        form: pokemon.form,
        versionForm: pokemon.versionForm,
        normalCount: newNormalCount,
        shinyCount: newShinyCount,
      };

      pokemonAdded++;
    }

    await User.updateOne(
      { discordId: user.discordId },
      { $set: { "savePokemon.data": savePokemon } },
    );

    updatedCount++;
    if (verbose) {
      console.log(
        `Updated user ${user.discordId}: Added ${pokemonAdded} pokemon entries`,
      );
    }
  }

  return { updatedCount, userCount };
}
