"use client"

import { PropsWithChildren, useState } from "react"
import { Icons } from "./icons"
import {
  Cog,
  Gift,
  Headphones,
  HelpCircle,
  Inbox,
  Menu,
  Mic,
  Phone,
  Pin,
  PlusCircle,
  Search,
  Smile,
  Sticker,
  UserCircle,
  Video,
  X,
} from "lucide-react"
import Image from "next/image"
import { cn } from "../lib/utils"

interface Server {
  id: string
  name: string
  initial: string
  unread?: boolean
  mentions?: number
}

interface DirectMessage {
  id: string
  name: string
  avatar?: string
  status?: "online" | "idle" | "dnd" | "offline"
  typing?: boolean
}

interface MockDiscordUIProps extends PropsWithChildren {
  className?: string
  showServerList?: boolean
  showDirectMessages?: boolean
  servers?: Server[]
  directMessages?: DirectMessage[]
}

const defaultServers: Server[] = Array.from({ length: 5 }, (_, i) => ({
  id: `server-${i}`,
  name: `Server ${String.fromCharCode(65 + i)}`,
  initial: String.fromCharCode(65 + i),
  unread: Math.random() > 0.7,
  mentions: Math.random() > 0.8 ? Math.floor(Math.random() * 9) + 1 : 0,
}))

const defaultDirectMessages: DirectMessage[] = [
  {
    id: "pingpanda",
    name: "PingPanda",
    avatar: "/brand-asset-profile-picture.png",
    status: "online",
    typing: true,
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `user-${i}`,
    name: `User ${i + 1}`,
    status: ["online", "idle", "dnd", "offline"][
      Math.floor(Math.random() * 4)
    ] as DirectMessage["status"],
  })),
]

export const MockDiscordUI = ({
  children,
  className,
  showServerList = true,
  showDirectMessages = true,
  servers = defaultServers,
  directMessages = defaultDirectMessages,
}: MockDiscordUIProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)

  return (
    <div
      className={cn(
        "flex min-h-[800px] w-full max-w-[1200px] bg-discord-background text-white rounded-lg overflow-hidden shadow-xl relative",
        className
      )}
    >
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Server list */}
      {showServerList && (
        <div
          className={cn(
            "w-[72px] bg-[#202225] py-3 flex-col items-center",
            isMobileMenuOpen ? "fixed inset-y-0 left-0 z-50" : "hidden sm:flex"
          )}
        >
          <button
            className="size-12 bg-discord-brand-color rounded-2xl flex items-center justify-center mb-2 hover:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Home"
          >
            <Icons.discord className="size-3/5 text-white" />
          </button>

          <div className="w-8 h-[2px] bg-discord-background rounded-full my-2" />

          <div className="flex-1 overflow-y-auto space-y-2 w-full px-2">
            {servers.map((server) => (
              <button
                key={server.id}
                className="relative w-full group"
                aria-label={server.name}
              >
                <div
                  className={cn(
                    "absolute left-0 w-1 rounded-r-full transition-all",
                    server.unread
                      ? "h-5 bg-white top-1/2 -translate-y-1/2"
                      : "h-2 bg-white/50 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:h-5"
                  )}
                />
                <div className="size-12 bg-discord-background rounded-3xl flex items-center justify-center hover:rounded-xl transition-all duration-200 hover:bg-discord-brand-color group-focus:ring-2 group-focus:ring-white/20">
                  <span className="text-lg font-semibold text-gray-400 group-hover:text-white transition-colors">
                    {server.initial}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            className="group mt-auto size-12 bg-discord-background rounded-3xl flex items-center justify-center mb-3 hover:rounded-xl transition-all duration-200 hover:bg-[#3ba55c] focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Add Server"
          >
            <PlusCircle className="text-[#3ba55c] group-hover:text-white" />
          </button>
        </div>
      )}

      {/* DM list */}
      {showDirectMessages && (
        <div
          className={cn(
            "w-60 bg-[#2f3136] flex-col",
            isMobileMenuOpen
              ? "fixed inset-y-0 left-[72px] z-50"
              : "hidden md:flex"
          )}
        >
          <div className="px-4 h-16 border-b border-[#202225] flex items-center shadow-sm">
            <button className="w-full bg-[#202225] text-sm rounded px-2 h-8 flex items-center justify-center text-gray-500 hover:bg-[#36393f] transition-colors">
              Find or start a conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-4">
            <div className="px-2 mb-4">
              <button className="w-full flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] transition-colors">
                <UserCircle className="mr-4 size-8 text-[#b9bbbe]" />
                <span className="font-medium text-sm">Friends</span>
              </button>
              <button className="w-full flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] transition-colors">
                <Inbox className="mr-4 size-8 text-[#b9bbbe]" />
                <span className="font-medium text-sm">Nitro</span>
              </button>
            </div>

            <div className="px-2 mb-4">
              <h3 className="text-xs font-semibold text-[#8e9297] px-2 mb-2 uppercase">
                Direct Messages
              </h3>

              <div className="space-y-px">
                {directMessages.map((dm) => (
                  <button
                    key={dm.id}
                    className={cn(
                      "w-full flex items-center px-2 py-1.5 rounded transition-colors",
                      dm.id === "pingpanda"
                        ? "bg-[#393c43] text-white"
                        : "text-gray-400 hover:bg-[#393c43] hover:text-gray-100"
                    )}
                  >
                    <div className="relative">
                      {dm.avatar ? (
                        <Image
                          src={dm.avatar}
                          alt={`${dm.name}'s Avatar`}
                          width={32}
                          height={32}
                          className="object-cover rounded-full mr-3"
                        />
                      ) : (
                        <div className="size-8 rounded-full bg-discord-background mr-3" />
                      )}
                      {dm.status && (
                        <div
                          className={cn(
                            "absolute bottom-0 right-3 size-3 rounded-full border-2 border-[#2f3136]",
                            {
                              "bg-green-500": dm.status === "online",
                              "bg-yellow-500": dm.status === "idle",
                              "bg-red-500": dm.status === "dnd",
                              "bg-gray-500": dm.status === "offline",
                            }
                          )}
                        />
                      )}
                    </div>
                    <span className="font-medium">{dm.name}</span>
                    {dm.typing && (
                      <span className="ml-auto text-xs text-gray-400">
                        typing...
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2 bg-[#292b2f] flex items-center">
            <div className="relative">
              <div className="size-8 rounded-full bg-brand-700 mr-2" />
              <div
                className={cn(
                  "absolute bottom-0 right-2 size-3 rounded-full border-2 border-[#292b2f]",
                  "bg-green-500"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">You</p>
              <p className="text-xs text-[#b9bbbe] truncate">@your_account</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className={cn(
                  "hover:text-white transition-colors focus:outline-none focus:text-white",
                  isMuted ? "text-red-400" : "text-[#b9bbbe]"
                )}
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                <Mic className="size-5" />
              </button>
              <button
                className={cn(
                  "hover:text-white transition-colors focus:outline-none focus:text-white",
                  isDeafened ? "text-red-400" : "text-[#b9bbbe]"
                )}
                onClick={() => setIsDeafened(!isDeafened)}
                aria-label={isDeafened ? "Undeafen" : "Deafen"}
              >
                <Headphones className="size-5" />
              </button>
              <button
                className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white"
                aria-label="Settings"
              >
                <Cog className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* DM header */}
        <div className="h-16 bg-[#36393f] flex items-center px-4 shadow-sm border-b border-[#202225]">
          {showDirectMessages && (
            <button
              className="md:hidden mr-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="size-6 text-[#b9bbbe] hover:text-white" />
              ) : (
                <Menu className="size-6 text-[#b9bbbe] hover:text-white" />
              )}
            </button>
          )}

          <div className="flex items-center">
            <div className="relative">
              <Image
                src="/brand-asset-profile-picture.png"
                alt="PingPanda Avatar"
                width={40}
                height={40}
                className="object-cover rounded-full mr-3"
              />
              <div className="absolute bottom-0 right-3 size-3 bg-green-500 rounded-full border-2 border-[#36393f]" />
            </div>

            <p className="font-semibold text-white">PingPanda</p>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <button
              className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
              aria-label="Start Voice Call"
            >
              <Phone className="size-5" />
            </button>
            <button
              className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
              aria-label="Start Video Call"
            >
              <Video className="size-5" />
            </button>
            <button
              className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
              aria-label="Pin Message"
            >
              <Pin className="size-5" />
            </button>
            <button
              className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
              aria-label="Add Friend"
            >
              <UserCircle className="size-5" />
            </button>
            <button
              className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>
            <button
              className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
              aria-label="Inbox"
            >
              <Inbox className="size-5" />
            </button>
            <button
              className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
              aria-label="Help"
            >
              <HelpCircle className="size-5" />
            </button>
          </div>
        </div>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-4 bg-discord-background flex flex-col-reverse">
          {children}
        </div>

        {/* Message input */}
        <div className="p-4">
          <div className="flex items-center bg-[#40444b] rounded-lg p-1">
            <button
              className="mx-3 text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white"
              aria-label="Add File"
            >
              <PlusCircle className="size-5" />
            </button>
            <input
              type="text"
              placeholder="Message @PingPanda"
              className="flex-1 bg-transparent py-2.5 px-1 text-white placeholder-[#72767d] focus:outline-none"
            />
            <div className="flex items-center space-x-3 mx-3">
              <button
                className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
                aria-label="Send Gift"
              >
                <Gift className="size-5" />
              </button>
              <button
                className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
                aria-label="Add Sticker"
              >
                <Sticker className="size-5" />
              </button>
              <button
                className="text-[#b9bbbe] hover:text-white transition-colors focus:outline-none focus:text-white hidden sm:block"
                aria-label="Add Emoji"
              >
                <Smile className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
