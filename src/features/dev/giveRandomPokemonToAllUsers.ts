import { User } from "../../core/schemas/User";
import allPokemon from "../../data/json/pokemon.json";
import { random } from "../../utils/helperFunction";

export type GiveRandomPokemonToAllUsersResult = {
  updatedCount: number;
  skippedCount: number;
};

let devGivePokemonInFlight = false;

export function isDevGivePokemonCommandAllowed(authorId: string): boolean {
  const env = process.env.ENVIRONMENT?.trim();
  const devId = process.env.DEV_ID?.trim() ?? "";
  return env === "dev" && devId !== "" && authorId === devId;
}

export async function giveRandomPokemonToAllUsers(): Promise<GiveRandomPokemonToAllUsersResult> {
  const users = await User.find({}).lean();
  console.log(`Found ${users.length} users`);

  const validPokemon = allPokemon.filter((p) => p.id !== 0);
  let updatedCount = 0;
  let skippedCount = 0;

  for (const user of users) {
    const savePokemon = user.savePokemon?.data || {};

    if (!savePokemon || Object.keys(savePokemon).length === 0) {
      console.log(`Skipping user ${user.discordId} - no pokemon initialized`);
      skippedCount++;
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
    console.log(
      `Updated user ${user.discordId}: Added ${pokemonAdded} pokemon entries`,
    );
  }

  console.log(`\nCompleted! Updated ${updatedCount} users`);
  return { updatedCount, skippedCount };
}

export async function giveRandomPokemonToAllUsersFromDiscord(): Promise<
  | { status: "ok"; updatedCount: number; skippedCount: number }
  | { status: "busy" }
> {
  if (devGivePokemonInFlight) {
    return { status: "busy" };
  }
  devGivePokemonInFlight = true;
  try {
    const { updatedCount, skippedCount } = await giveRandomPokemonToAllUsers();
    return { status: "ok", updatedCount, skippedCount };
  } finally {
    devGivePokemonInFlight = false;
  }
}
