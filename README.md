# Rubedo Version 2.4.0

Welcome to Rubedo, Rubedo is a brand new Anti-cheat designed for Realms, Servers, Worlds and anyone who wants to protect their worlds from Hackers! Rubedo Uses Minecrafts Most advanced functionality so that includes Gametest.

[![Rubedo showcase video](https://img.youtube.com/vi/PYWC_zwmfj8/0.jpg)](https://www.youtube.com/watch?v=PYWC_zwmfj8)

## Features

Rubedo is coded in the Brand new Smelly API V4. This API is extremly Powerful it builds and expands all the possibilites making this anti-cheat possible

- Check out Smelly API: https://github.com/smell-of-curry/Smelly-API

## Permissions:

As Rubedo is top of the line, permissions and security is at top priority.

### Managing Players permisions

Before you can start managing players permissions you will need to get permission yourself, first time joining the world you will need to run in chat:

```bash
/function start
```

This will Enable you as a `admin` and give you permission to everything in Rubedo

To change permissions simply run this command

```bash
-role set <player: String> <role: "member" | "moderator" | "admin">
```

So for example:

```bash
-role set "Smell of curry" "admin"
```

Its a very simple system and you can manage players permissions with ease
to view permissions simply:

```bash
-role get <player: String>
```

## Commands:

See all commands in game by running **-help** in chat, Please note the permissions
on each command before using it, to manage permissions use `-role set <player: string> <role: "admin" | "moderator" | "member">`

Also Please note that when ever it asks for a player name
that would require you to add spaces use quotes around your agument.

### Get a list of all commands

**Permission's**: `[]`

NOTE: the help command will ONLY show you the command you CAN run at your current staff level

```
-help <page: number>
-help <command: string>
```

#### Examples:

```
-help
-help 2
-help ban
```

### Ping

**Permission's**: `[]`

Gets the current ping of the server

```
-ping <page: number>
```

### Version

**Permission's**: `[]`

Gets the current version of Rubedo

```
-version
```

### Bans a Player for a length:

**Permission's**: `["admin"]`

```
-ban <player: string> <length: int> <unit: string> [reason: string]
```

Unit can be one of `years | yrs | weeks | days | hours | hrs | minutes | mins | seconds | secs | milliseconds | msecs | ms`

Or a date formated like `smhdwy`

#### Example

```
-ban "Smell of curry" 20 mins "Hes too good"
```

### Unban a banned player

**Permission's**: `["admin"]`

```
-unban <player: string>
```

#### Example

```
-unban "Smell of curry"
```

### Freeze a player

**Permission's**: `["admin"]`

This stops the player from moving

```
-freeze <player: string> <reason: string>
```

#### Example

```
-freeze "Smell of curry" Hacking
```

### Unfreeze a frozen player

**Permission's**: `["admin"]`

This stops the player from moving

```
-unfreeze <player: string>
```

#### Example

```
-unfreeze "Smell of curry"
```

### Spectate the world

**Permission's**: `["admin"]`

This Changes you into a spectator mode where you are completly invisable

```
-spectate
```

### Mute a player for lengths

**Permission's**: `["admin", "moderator"]`

NOTE: Unit works the same as the ban command

```
-mute <player: string> <length: int> <unit: string> [reason: string]
```

#### Example

```
-mute "Smell of curry" 5 hrs "Sending bad stuff in chat"
```

### UnMute a player

**Permission's**: `["admin", "moderator"]`

```
-unmute <player: string>
```

#### Example

```
-unmute "Smell of curry"
```

### Clear a players enderchest

**Permission's**: `["admin"]`

```
-ecwipe <player: string>
```

#### Example

```
-ecwipe "Smell of curry"
```

### Spawn a NPC

**Permission's**: `["admin"]`
NOTE: This will spawn a npc at the command users current location

```
-npc
```

## Regions

Regions are a very important part of Rubedo because it protects
areas from being destroyed or people attacking or anything
that a protected region would need.

#### Add a new protection region

**Permission's**: `["admin"]`

```
-region add <from_x: int> <from_z: int> <to_x:int> <to_z: int> [name: string]
```

#### Example

```
-region add 20 90 300 900 "Spawn"
```

#### Remove a region

**Permission's**: `["admin"]`

NOTE: This removes the region the player is CURRENTLY STANDING IN

```
-region remove
```

#### List all regions

**Permission's**: `["admin"]`

```
-region list
```

### Region Permissions

NOTE: The config.js contains a configurable list of toggles for what
a default region can do

```js
/**
 * The default permissions for all regions made
 */
export const DEFAULT_REGION_PERMISSIONS = {
  /**
   * If players in this region can use doors, trapdoors, and switches like buttons and levers
   */
  doorsAndSwitches: true,
  /**
   * If players in this region can open containers, this is like chests, furnaces, hoppers, etc
   */
  openContainers: true,
  /**
   * If the players in this region can fight each other
   */
  pvp: false,
};
```

### Changing a regions permission

**Permission's**: `["admin"]`

NOTE: Running this will automactily change the permission of the
CURRENT region the player is in

```
-region permission set <key: doorsAndSwitches | openContainers | pvp> <value: boolean>
```

#### Example

```
-region permission set pvp false
-region permission set openContainers false
-region permission set doorsAndSwitches true
```

### List the current permissions for this region

**Permission's**: `["admin"]`

NOTE: This will return the region permissions for the region the player is in

```
-region permission list
```

## Modules:

- **Minecraft Bedrock Anti CBE**: This is a anti hacked items, meaning it checks a players inventory every tick then it tests if they have any banned items, then checks if they have items that have hacked enchants and clears the item from inventory

- **Minecraft Bedrock Anti Crasher**: This anti crasher works by testing if a player has reached a location Horion's crasher teleports the player to 30 Million so we just test for That location and if they are there we kick the player (USES: player.json)

- **Minecraft Bedrock Anti Enchants**: This is an anti enchants. This system is used to check all the players inventorys, it searches it for hacked enchants. It figures out its hacked by using a predifined max level for enchant defined in ../Models/Enchantments.js

- **Minecraft Bedrock Anti Fly**: This anti fly works by detecting horizontal velocity, bassicly when the player has reached the FLYING_VELOCITY they are considered flying And if they are considered flying for 1 second they will be teleported back.

- **Minecraft Bedrock Anti Gamemode**: This checks every tick to test if a player has entered a gamemode that they shouldnet be able to get into. If the player has the staff tag it wont check the list of illegle gamemodes are below, once it knows you are in creative it will set you back and clear your inventory

- **Minecraft Bedrock Anti NameSpoof**: This is a anti Bad gamertag it checks when a player joins if there name is invaild it determins its invalid by checking the length and characters in it the requirememts are from xbox gamertag requiremnts

- **Minecraft Bedrock Anti Nuker**: This anti nuker works by loging everytime a player breaks a block Then the next time they break a block it tests the time from now to then And if they broke a block in 50 miliseconds than we place that block back

- **Minecraft Bedrock Anti Bad Blocks**: This anti block place stops players from placing unwanted blocks Simpliy when a player places a blocks it tests if that block is banned And cancles that block from being placed, (add more blocks to list)

- **Minecraft Bedrock Anti Reach**: Detect players who are reaching and autmaticly cancel that action Works with block placing, block interacting, block destroying, and hurting entitys. tests by using 7 block max reach distance

## Configuration

Rubedo has made it so easy to edit all of its config files in game. Most Anti cheats make it so
you have to know how to edit files and make packs, but with rubedo you can do it all in game
with commands

### Manage Protections

**Permission's**: `["admin"]`

protections is the name used for the man modules of rubedo this includes stuff like anti nuker, anti reach...

value is the name of this protection you can view all of them in game using -help

```
-config protections enable <value: string>
-config protections disable <value: string>
-config protections list
```

### Manage commands

**Permission's**: `["admin"]`

These commands will allow you to disable and enable certain commands

value is the command name you can view all of them in game using -help

```
-config commands enable <value: string>
-config commands disable <value: string>
-config commands list
```

### Manage managers

**Permission's**: `["admin"]`

Managers are the main components of rubedo there used to really moderate the server and manage bans, mutes, etc...

value is the manager name you can view all of them in game using -help

```
-config managers enable <value: string>
-config managers disable <value: string>
-config managers list
```

### Manage Banned items

**Permission's**: `["admin"]`

You can change what items are banned by adding or removing them with these commands

item is the item id of this item looks like "minecraft:item"

```
-config banned items add <item: string>
-config banned items remove <item: string>
```

### Manage Banned Blocks

**Permission's**: `["admin"]`

You can change what blocks are banned by adding or removing them with these commands

block is the block id of this item looks like "minecraft:block"

```
-config banned blocks add <block: string>
-config banned blocks remove <item: string>
```

### Manage Max enchantment levels

**Permission's**: `["admin"]`

manage all the max enchantments that this server bans with this command

enchantment is the enchantmentType id you can view these in game using -help

```
-config enchantments set <enchantment: string>
-config enchantments get <enchantment: string>
```

## Support

As Rubedo is Still in beta, there might be bugs that you could face. If you need support PLEASE Join the discord and subbmit your problems here: https://discord.gg/a9MjfydsFz
