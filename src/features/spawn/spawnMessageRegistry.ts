const registry = new Map<string, string>();

function makeKey(serverId: string, channelId: string): string {
  return `${serverId}_${channelId}`;
}

export function registerSpawnMessage(
  serverId: string,
  channelId: string,
  messageId: string,
): void {
  registry.set(makeKey(serverId, channelId), messageId);
}

export function getSpawnMessageId(
  serverId: string,
  channelId: string,
): string | undefined {
  return registry.get(makeKey(serverId, channelId));
}

export function clearSpawnMessage(serverId: string, channelId: string): void {
  registry.delete(makeKey(serverId, channelId));
}
