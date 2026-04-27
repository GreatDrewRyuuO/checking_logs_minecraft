// Minecraft mob list ครบทุก version (Java Edition)
export const MINECRAFT_MOBS: Record<string, string[]> = {
  "Passive": [
    "ALLAY", "ARMADILLO", "BAT", "CAT", "CHICKEN", "COD", "COW",
    "DONKEY", "FROG", "GLOW_SQUID", "HORSE", "MOOSHROOM", "MULE",
    "OCELOT", "PARROT", "PIG", "PUFFERFISH", "RABBIT", "SALMON",
    "SHEEP", "SKELETON_HORSE", "SNIFFER", "SNOW_GOLEM", "SQUID",
    "STRIDER", "TADPOLE", "TROPICAL_FISH", "TURTLE", "VILLAGER",
    "WANDERING_TRADER",
  ],
  "Neutral": [
    "BEE", "CAVE_SPIDER", "DOLPHIN", "ENDERMAN", "FOX", "GOAT",
    "IRON_GOLEM", "LLAMA", "PANDA", "PIGLIN", "POLAR_BEAR",
    "SPIDER", "TRADER_LLAMA", "WOLF", "ZOMBIFIED_PIGLIN",
  ],
  "Hostile": [
    "BLAZE", "BOGGED", "BREEZE", "CREEPER", "DROWNED", "ELDER_GUARDIAN",
    "ENDERMITE", "EVOKER", "GHAST", "GUARDIAN", "HOGLIN", "HUSK",
    "MAGMA_CUBE", "PHANTOM", "PIGLIN_BRUTE", "PILLAGER", "RAVAGER",
    "SHULKER", "SILVERFISH", "SKELETON", "SLIME", "STRAY", "VEX",
    "VINDICATOR", "WARDEN", "WITCH", "WITHER_SKELETON", "ZOGLIN",
    "ZOMBIE", "ZOMBIE_VILLAGER",
  ],
  "Boss": [
    "ELDER_GUARDIAN", "ENDER_DRAGON", "WITHER",
  ],
};

export const ALL_MOBS = Object.values(MINECRAFT_MOBS).flat();

export function formatMobName(mob: string): string {
  return mob
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}
