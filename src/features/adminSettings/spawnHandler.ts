import { SelectionPath, MenuHandler, MenuOption } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { updateServer, getServerById } from "../../cache/ServerCache";
import language from "../../lang/language";
import { BaseGuildTextChannel, PermissionFlagsBits, ChatInputCommandInteraction, Guild, EmbedBuilder } from "discord.js";
import { newLogger } from "../../middlewares/logger";

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
    const availableChannels = this.guild ? this.getAvailableChannelsMenuOptions(this.guild) : undefined;
    const allowedChannels = this.guild ? this.getAllowedChannelsMenuOptions(this.guild) : undefined;
    
    const children: MenuOption[] = [
      {
        label: language("adminSettingsSpawnAdd", this.server.settings.language),
        value: "add",
        description: language("adminSettingsSpawnAddDescription", this.server.settings.language),
        placeholder: language("adminSettingsSpawnAddPlaceholder", this.server.settings.language),
        children: availableChannels,
      },
      {
        label: language("adminSettingsSpawnRemove", this.server.settings.language),
        value: "remove",
        description: language("adminSettingsSpawnRemoveDescription", this.server.settings.language),
        placeholder: language("adminSettingsSpawnRemovePlaceholder", this.server.settings.language),
        children: allowedChannels,
      },
    ];

    return {
      label: language("adminSettingsSpawnLabel", this.server.settings.language),
      value: "spawn",
      description: language("adminSettingsSpawnDescription", this.server.settings.language),
      placeholder: language("adminSettingsSpawnPlaceholder", this.server.settings.language),
      children: children,
      getEmbed: () => this.getMainEmbed(),
    };
  }

  private getMainEmbed(): EmbedBuilder {
    const lang = this.server.settings.language;
    const embed = new EmbedBuilder()
      .setTitle(language("adminSettingsSpawnEmbedTitle", lang))
      .setDescription(language("adminSettingsSpawnEmbedDescription", lang))
      .setColor(0x0099ff);

    if (!this.guild) {
      embed.setDescription(language("adminSettingsSpawnEmbedNoChannels", lang));
      return embed;
    }

    const channelsList: string[] = [];
    let goodPermissionsCount = 0;
    let totalCount = 0;

    const botMember = this.guild.members.cache.get(this.guild.client.user?.id);
    
    this.server.channelAllowed.forEach((channelId: string) => {
      totalCount++;
      const channel = this.guild!.channels.cache.get(channelId);
      
      if (!channel) {
        channelsList.push(
          language("adminSettingsSpawnEmbedChannelDeleted", lang)
            .replace("{channelId}", channelId)
        );
        return;
      }

      if (!channel.isTextBased() || !(channel instanceof BaseGuildTextChannel)) {
        return;
      }

      const channelName = channel.name;
      const categoryName = channel.parent?.name || language("adminSettingsSpawnNoCategory", lang);
      const displayName = `${categoryName} - ${channelName}`;

      if (botMember) {
        const permissions = botMember.permissionsIn(channel);
        const hasPermission = permissions.has(PermissionFlagsBits.SendMessages) && 
                             permissions.has(PermissionFlagsBits.ViewChannel);
        
        if (hasPermission) {
          goodPermissionsCount++;
          channelsList.push(
            language("adminSettingsSpawnEmbedChannelWithPermission", lang)
              .replace("{channelName}", displayName)
          );
        } else {
          channelsList.push(
            language("adminSettingsSpawnEmbedChannelWithoutPermission", lang)
              .replace("{channelName}", displayName)
          );
        }
      } else {
        channelsList.push(
          language("adminSettingsSpawnEmbedChannelWithPermission", lang)
            .replace("{channelName}", displayName)
        );
      }
    });

    if (channelsList.length === 0) {
      embed.setDescription(language("adminSettingsSpawnEmbedNoChannels", lang));
    } else {
      const channelsText = channelsList.join("\n");
      embed.addFields({
        name: language("adminSettingsSpawnEmbedPermissionsCount", lang)
          .replace("{goodCount}", goodPermissionsCount.toString())
          .replace("{totalCount}", totalCount.toString()),
        value: channelsText.length > 1024 
          ? channelsText.substring(0, 1021) + "..." 
          : channelsText,
      });
    }

    embed.addFields({
      name: language("adminSettingsSpawnEmbedTutorialTitle", lang),
      value: language("adminSettingsSpawnEmbedTutorialContent", lang),
      inline: false,
    });

    return embed;
  }

  private getAvailableChannelsMenuOptions(guild: Guild): MenuOption[] {
    if (!guild) {
      return [];
    }
    
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
    const botMember = guild.members.cache.get(guild.client.user?.id);
    
    this.server.channelAllowed.forEach((channelId: string) => {
      const channel = guild.channels.cache.get(channelId);
      
      if (!channel) {
        const deletedLabel = language("adminSettingsSpawnDeletedChannel", this.server.settings.language)
          .replace("{channelId}", channelId);
        allowedChannels.push({
          label: `❌ ${deletedLabel}`,
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
      
      let permissionEmoji = "✅";
      if (botMember) {
        const permissions = botMember.permissionsIn(channel);
        const hasPermission = permissions.has(PermissionFlagsBits.SendMessages) && 
                             permissions.has(PermissionFlagsBits.ViewChannel);
        if (!hasPermission) {
          permissionEmoji = "❌";
        }
      }
      
      const label = `${permissionEmoji} ${displayName}`;
      const finalLabel = label.length > 100 ? label.substring(0, 97) + "..." : label;
      
      const description = language("adminSettingsSpawnRemoveChannelDescription", this.server.settings.language)
        .replace("{channelName}", channelName);
      
      allowedChannels.push({
        label: finalLabel,
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
      try {
        const freshServer = await getServerById(this.server.discordId);
        this.server = freshServer;
      } catch (error) {
        newLogger("error", `[spawnHandler] Error reloading server: ${error}`, `Failed to reload server ${this.server.discordId}`);
      }
      
      if (this.server.channelAllowed.includes(channelId)) {
        return;
      }
      
      this.server.channelAllowed.push(channelId);
      
      try {
        await updateServer(this.server.discordId, this.server);
      } catch (error) {
        newLogger("error", `[spawnHandler] Error updating server: ${error}`, `Failed to update server ${this.server.discordId}`);
      }
      
      if (this.guild) {
        const channel = this.guild.channels.cache.get(channelId);
        if (channel && channel.isTextBased() && channel instanceof BaseGuildTextChannel) {
          try {
            await channel.send(language("adminSettingsSpawnChannelAddedMessage", lang));
          } catch (error) {
            newLogger("error", `[spawnHandler] Error sending message to channel: ${error}`, `Failed to send message to channel ${channelId}`);
          }
        }
      }
      
      if (this.interaction) {
        try {
          await this.interaction.followUp({
            content: language("spawnPokemonActivate", lang),
            ephemeral: true,
          });
        } catch (error) {
          newLogger("error", `[spawnHandler] Error sending followUp: ${error}`, `Failed to send followUp for interaction ${this.interaction.id}`);
        }
      }
    } else if (action === "remove") {
      try {
        const freshServer = await getServerById(this.server.discordId);
        this.server = freshServer;
      } catch (error) {
        newLogger("error", `[spawnHandler] Error reloading server: ${error}`, `Failed to reload server ${this.server.discordId}`);
      }
      
      const index = this.server.channelAllowed.indexOf(channelId);
      
      if (index > -1) {
        this.server.channelAllowed.splice(index, 1);
        
        try {
          await updateServer(this.server.discordId, this.server);
        } catch (error) {
          newLogger("error", `[spawnHandler] Error updating server: ${error}`, `Failed to update server ${this.server.discordId}`);
        }
        
        if (this.guild) {
          const channel = this.guild.channels.cache.get(channelId);
          if (channel && channel.isTextBased() && channel instanceof BaseGuildTextChannel) {
            try {
              await channel.send(language("adminSettingsSpawnChannelRemovedMessage", lang));
            } catch (error) {
              newLogger("error", `[spawnHandler] Error sending message to channel: ${error}`, `Failed to send message to channel ${channelId}`);
            }
          }
        }
        
        if (this.interaction) {
          try {
            await this.interaction.followUp({
              content: language("spawnPokemonDesactivate", lang),
              ephemeral: true,
            });
          } catch (error) {
            newLogger("error", `[spawnHandler] Error sending followUp: ${error}`, `Failed to send followUp for interaction ${this.interaction.id}`);
          }
        }
      }
    }
  }
}