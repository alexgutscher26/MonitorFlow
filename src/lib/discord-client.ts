import { REST } from "@discordjs/rest"
import {
  RESTPostAPIChannelMessageResult,
  RESTPostAPICurrentUserCreateDMChannelResult,
  Routes,
  APIEmbed,
} from "discord-api-types/v10"

/**
 * A client for interacting with Discord's REST API, allowing direct message creation and embed message sending.
 */
export class DiscordClient {
  private rest: REST

  /**
   * Initializes the Discord client with a bot token for authorization.
   *
   * @param token - The Discord bot token for authenticating API requests.
   */
  constructor(token: string | undefined) {
    this.rest = new REST({ version: "10" }).setToken(token ?? "")
  }

  /**
   * Creates a direct message (DM) channel with a user.
   *
   * @param userId - The ID of the user to open a DM channel with.
   * @returns A promise that resolves with the DM channel information.
   */
  async createDM(
    userId: string
  ): Promise<RESTPostAPICurrentUserCreateDMChannelResult> {
    return this.rest.post(Routes.userChannels(), {
      body: { recipient_id: userId },
    }) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>
  }

  /**
   * Sends an embed message to a specific channel.
   *
   * @param channelId - The ID of the channel to send the embed message to.
   * @param embed - The embed object to send, following Discord's embed structure.
   * @returns A promise that resolves with the result of the message posting.
   */
  async sendEmbed(
    channelId: string,
    embed: APIEmbed
  ): Promise<RESTPostAPIChannelMessageResult> {
    return this.rest.post(Routes.channelMessages(channelId), {
      body: { embeds: [embed] },
    }) as Promise<RESTPostAPIChannelMessageResult>
  }
}
