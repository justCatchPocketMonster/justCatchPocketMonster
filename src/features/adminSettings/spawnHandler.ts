import { SelectionPath, MenuHandler, MenuOption } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { updateServer } from "../../cache/ServerCache";
import language from "../../lang/language";
import { BaseGuildTextChannel, GuildTextBasedChannel, PermissionFlagsBits, ChatInputCommandInteraction, Guild } from "discord.js";

export class spawnHandler implements MenuHandler {
  server: Server;
  interaction?: ChatInputCommandInteraction;
  guild?: Guild;
  
  constructor(server: Server, interaction: ChatInputCommandInteraction) {
    this.server = server;
    this.interaction = interaction;
    this.guild = interaction?.guild || undefined;
  }
  
  getMenuStructure(): MenuOption {
    const children: MenuOption[] = [
      {
        label: language("adminSettingsSpawnAdd", this.server.settings.language),
        value: "add",
        description: language("adminSettingsSpawnAddDescription", this.server.settings.language),
        children: this.guild ? this.getAvailableChannelsMenuOptions(this.guild) : undefined,
      },
      {
        label: language("adminSettingsSpawnRemove", this.server.settings.language),
        value: "remove",
        description: language("adminSettingsSpawnRemoveDescription", this.server.settings.language),
        children: this.guild ? this.getAllowedChannelsMenuOptions(this.guild) : undefined,
      },
    ];

    return {
      label: language("adminSettingsSpawnLabel", this.server.settings.language),
      value: "spawn",
      description: language("adminSettingsSpawnDescription", this.server.settings.language),
      children: children,
    };
  }

  private getAvailableChannelsMenuOptions(guild: Guild): MenuOption[] {
    if (!guild) return [];
    
    const availableChannels: MenuOption[] = [];
    const channelAllowedSet = new Set(this.server.channelAllowed);
    
    guild.channels.cache.forEach((channel) => {
      if (!channel.isTextBased() || !(channel instanceof BaseGuildTextChannel)) {
        return;
      }
      
      const botMember = guild.members.cache.get(guild.client.user?.id);
      if (!botMember) return;
      
      const permissions = botMember.permissionsIn(channel);
      if (!permissions.has(PermissionFlagsBits.SendMessages) || 
          !permissions.has(PermissionFlagsBits.ViewChannel)) {
        return;
      }
      
      if (channelAllowedSet.has(channel.id)) {
        return;
      }
      
      const categoryName = channel.parent?.name || language("adminSettingsSpawnNoCategory", this.server.settings.language);
      const channelName = channel.name;
      const displayName = `${categoryName} - ${channelName}`;
      
      const label = displayName.length > 100 ? displayName.substring(0, 97) + "..." : displayName;
      
      const description = language("adminSettingsSpawnAddChannelDescription", this.server.settings.language)
        .replace("{channelName}", channelName);
      
      availableChannels.push({
        label: label,
        value: channel.id,
        description: description,
      });
    });
    
    if (availableChannels.length === 0) {
      return [{
        label: language("adminSettingsSpawnNoChannelsAvailable", this.server.settings.language),
        value: "no_channels",
        description: language("adminSettingsSpawnNoChannelsAvailableDescription", this.server.settings.language),
      }];
    }
    
    return availableChannels.sort((a, b) => a.label.localeCompare(b.label));
  }

  private getAllowedChannelsMenuOptions(guild: Guild): MenuOption[] {
    if (!guild) return [];
    
    const allowedChannels: MenuOption[] = [];
    
    this.server.channelAllowed.forEach((channelId: string) => {
      const channel = guild.channels.cache.get(channelId);
      
      if (!channel) {
        const deletedLabel = language("adminSettingsSpawnDeletedChannel", this.server.settings.language)
          .replace("{channelId}", channelId);
        allowedChannels.push({
          label: deletedLabel,
          value: channelId,
          description: language("adminSettingsSpawnDeletedChannelDescription", this.server.settings.language),
        });
        return;
      }
      
      if (!channel.isTextBased() || !(channel instanceof BaseGuildTextChannel)) {
        return;
      }
      
      const categoryName = channel.parent?.name || language("adminSettingsSpawnNoCategory", this.server.settings.language);
      const channelName = channel.name;
      const displayName = `${categoryName} - ${channelName}`;
      
      const label = displayName.length > 100 ? displayName.substring(0, 97) + "..." : displayName;
      
      const description = language("adminSettingsSpawnRemoveChannelDescription", this.server.settings.language)
        .replace("{channelName}", channelName);
      
      allowedChannels.push({
        label: label,
        value: channelId,
        description: description,
      });
    });
    
    if (allowedChannels.length === 0) {
      return [{
        label: language("adminSettingsSpawnNoChannelsAllowed", this.server.settings.language),
        value: "no_channels",
        description: language("adminSettingsSpawnNoChannelsAllowedDescription", this.server.settings.language),
      }];
    }
    
    return allowedChannels.sort((a, b) => a.label.localeCompare(b.label));
  }

  async handleAction(selectionPath: SelectionPath[]): Promise<void> {
    if (selectionPath.length < 3) {
      return;
    }
    
    const action = selectionPath[1].value;
    const channelId = selectionPath[2].value;
    
    if (channelId === "no_channels") {
      return;
    }
    
    const lang = this.server.settings.language;
    
    if (action === "add") {
      this.server.channelAllowed.push(channelId);
      await updateServer(this.server.discordId, this.server);
      
      if (this.interaction) {
        await this.interaction.followUp({
          content: language("spawnPokemonActivate", lang),
          ephemeral: true,
        });
      }
    } else if (action === "remove") {
      const index = this.server.channelAllowed.indexOf(channelId);
      if (index > -1) {
        this.server.channelAllowed.splice(index, 1);
        await updateServer(this.server.discordId, this.server);
        
        if (this.interaction) {
          await this.interaction.followUp({
            content: language("spawnPokemonDesactivate", lang),
            ephemeral: true,
          });
        }
      }
    }
  }
}

/**
 * TODO:
 * add message when channel is added or removed in the chosen channel
 * add emote in remove channel for see if the bot as always the permission to send messages in the channel
 * add an embed in main spawnHandler for see all allowed channels with a a emote if the bot has the permission to send messages in the channel
 * in the embed main principal embed we need a count of the allowed channels with good permissions slash all allowed channels
 */