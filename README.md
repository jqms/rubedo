# Rubedo Version 2.4.6-beta

Welcome to Rubedo, Rubedo is a brand new Anti-cheat designed for Realms, Servers, Worlds, and anyone who wants to protect their worlds from Hackers! Rubedo Uses Minecraft's Most advanced functionality which includes [Gametest](https://learn.microsoft.com/en-us/minecraft/creator/documents/gametestbuildyourfirstgametest).

![Rubedo thumbnail](https://api.mcpedl.com/storage/submissions/92154/100/anticheat_1-520x245.png)

## Requirements

The anticheat makes use of features that requires you to toggle them on. Without the features below the anticheat will not work/you will not be able to use the full features of them

- [x] Gametest enabled
- [x] EDU mode
- [x] cheats enabled
- [x] The addon is on top of everything if you got other addons (may cause issues with other addons)
      ![What you should enable](https://cdn.discordapp.com/attachments/1021518190104293447/1021518745673404426/unknown.png)

# Getting Started:

Upon applying the pack and joining the world the operator should run the command below which gives you **Admin** permissions.
The command gives full access to Rubedo. Ideally, the owner should run this command

> **Warning** **: THIS CAN ONLY BE RUN ONCE!! THE USER CAN GIVE OTHERS ADMIN PERMS VIA `-role`**

```bash
/function start
```

## Commands:

See all commands in-game by running **-help** in chat, Please note the permissions
on each command before using it.

> **Note**: PlayerName Argument requires quotes around name\*\*

### -help `[]`

> **Note**: the help command will only show commands that are available at your role level.

```bash
-help <page: number>
-help <command: string>
```

### -ping `[]`

Gets the current ping of the server

```bash
-ping <page: number>
```

### -version `[]`

Gets the current version of Rubedo

```bash
-version
```

### -role `["owner", "admin"]`

This command allows you to manage permissions of players in this world, the command
CAN acess offline players.

```bash
-role set <playerName: string> <role: "member" | "moderator" | "admin" | "builder">
```

```bash
-role set "Smell of curry" "admin"
```

Then to view a set role simply:

```bash
-role get <playerName: string>
```

### -ban `["admin"]`

```bash
-ban <playerName: playerName>
-ban <playerName: playerName> <length: int> <unit: UnitValueType>
-ban <playerName: playerName> <length: int> <unit: UnitValueType> <reason: string>
```

```bash
-ban "Smell of curry"
-ban "Smell of curry" 10 hours
-ban "Smell of curry" 20 mins "Hes too good"
```

### -unban `["admin"]`

```bash
-unban <playerName: string>
```

```bash
-unban "Smell of curry"
```

### -freeze `["admin"]`

This stops the player from moving

```bash
-freeze <player: playerName> <reason: string>
```

```bash
-freeze "Smell of curry" "Hacking"
```

### -unfreeze `["admin"]`

This stops the player from moving

```bash
-unfreeze <player: string>
```

```bash
-unfreeze "Smell of curry"
```

### -vanish `["admin"]`

This Changes you into a spectator mode where you are completely invisible, also can say messages in chat
making it seem like you left

![shows player left game](https://i.ibb.co/KrnnpFj/sdsdsd-Capture2sa.png)
![shows player joined game](https://i.ibb.co/9HGDW3L/Csdsdsdsdapture.png)

**Param**: `say`: this will toggle vanish and say something in chat

```bash
-vanish <say: boolean>
```

```bash
-vanish true
```

### -mute `["admin", "moderator"]`

```bash
-mute <player: playerName> <length: int> <unit: string> <reason: string>
```

```bash
-mute "Smell of curry" 5 hrs "Sending bad stuff in chat"
```

### -unmute `["admin", "moderator"]`

```bash
-unmute <player: string>
```

### -ecwipe `["admin"]`

Clears a player enderchest

```bash
-ecwipe <player: string>
```
```bash
-ecwipe "Smell of curry"
```

### -npc `["admin"]`

> **Note**: This will spawn an npc that will NOT get despawned by `cbe` protection

```bash
-npc
```

## Regions

Regions are an important part of rubedo. Regions protect land like spawn, parks, forests, simply anything you
want to protect players. Regions are really powerfull because they are configurable and can stop
all actions that happen in an area.

### Create a Region: `["admin"]`

```bash
-region add <from_x: int> <from_z: int> <to_x:int> <to_z: int>
```

```bash
-region add 20 90 300 900
```

### Remove a Region `["admin"]`

> **Note** This command selects the region that the player is currently standing in.

```bash
-region remove
```

Or You can remove all regions using:

```bash
-region removeAll
```

### List all regions `["admin"]`

```bash
-region list
```

### Changing Region Permissions `["admin"]`

> **Note**: Default Permissions are stored here: [`src\config\region.ts`](https://github.com/smell-of-curry/rubedo/blob/main/src/config/region.ts)

> **Note**: The `-region permission` command selects the current region the command executer is standing in

```bash
-region permission set <key: doorsAndSwitches | openContainers | pvp> <value: boolean>
```

```
-region permission set pvp false
-region permission set openContainers false
-region permission set doorsAndSwitches true
```

#### Managing what mobs can spawn `["admin"]`

```bash
-region permission entities add <entity: string>
-region permission entities remove <entity: string>
```

```bash
-region permission entities add "minecraft:cow"
-region permission entities remove "minecraft:cow"
```

### List the current permissions for this region `["admin"]`

```bash
-region permission list
```

## Modules:

- **Anti CBE**: Prevents users from using CBE (Commandblock Exploits) which is done by checking the inventory every tick for these illegal items and clearing it.

- **Anti Crasher**: patches a crashing method (typically used by Horion) that teleports a user 30 million blocks far and kicks a user hopefully preventing the crash (USES: player.json)

- **Anti Illegal Enchants**: Checks every player's inventory to see if any item has enchants above the predefined limit set in [enchantment.ts](src/config/enchantments.ts) or via `-config enchantments set "enchantment" value`

- **Anti Fly**: anti fly works by detecting horizontal velocity, when the user has FLYING_VELOCITY and is not under certain conditions they're considered as flying and, teleports them back to their position

- **Anti Gamemode**: Removes creative and clears the user inventory if the user is not an authorized user.

  > **Note**: **THIS IGNORES BUILDERS**

- **Anti NameSpoof**: Locates invalid Gamertags by comparing them against Xbox's Gamertag requirements and kicking the user out if they fail to meet them.

- **Anti Nuker**: works by logging the placement of blocks done by the player and detects if the next block break is done impossibly fast (50 milliseconds) then we cancel the breaking event.

- **ban bad Blocks/items**: checks if the player has illegal items or if they're placing a banned block and prevents the placement (while the ban list can be controlled via `-config`.

- **Anti Reach**: Detect players who are reaching and automatically cancel that action. This covers reach involving interacting, placing, breaking, and attacking. max reach is set to **7**.

# View Player's inventories & Ender Chests

First, you will need to make sure you have admin permission on your server, look at [Permissions](#permissions) for more details

Next give yourself `Rubedo:gui`
by typing in chat:

```bash
/give @s `Rubedo:gui`
```

Next Open your GUI and you should be prompted with this screen

![gui screen that shows a ender chest in middle](https://i.ibb.co/Bf0dDVN/Captusdsdsdsdre.png)

Next to view a list of players click on the ender chest, then you should be
prompted with this screen

![gui screen that shows a list of all players in the world](https://i.ibb.co/QjQXKP0/2Capture.png)

This screen should show each player in the world with a player head with their name as the nameTag
Click a player you want to view, then you will be shown their inventory:

![gui screen that shows a players inventory](https://i.ibb.co/Hg1fd9b/3Capture.png)

When clicking on items in the player's inventory it will remove them from the player's inventory and give
you the item

> **Note**: to view the players ender chest click the ender chest icon at the bottom of the gui screen

Once you open up the player's ender chest it should look like this:

![gui screen that shows a players ender chest](https://i.ibb.co/yQWnX7v/4Capture.png)

When clicking on items it will remove those items from their ender chest and give them to you

> **Note**: THIS SYSTEM **CANNOT** GRAB ANY NBT OF THE ITEM. ONLY THE ITEM ID

## Configuration

Rubedo has made it so easy to edit all of its config files in-game. Most Anti cheats make it so
you have to know how to edit files and make packs, but with Rubedo you can do it all in-game
with commands

## Support

As Rubedo is Still in beta, there might be bugs that you could face. If you need support PLEASE Join the [Discord](https://discord.gg/a9MjfydsFz) and submit your problems there
