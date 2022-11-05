export const text = {
  "api.name": () => "Smelly API",
  "api.error.unknown": () => "An unknown error has occured.",
  "api.database.error.table_name": (a: string, b: number) =>
    `The display name ${a} is too long for an objective, it can be at most ${b} characters long`,
  "api.utilities.formatter.error.ms": (a: string) =>
    `${a} is not a string or a number`,
  "api.Providers.form.invaildtype": (a: string, b: string) =>
    `Type ${a} is not a vaild type to add a ${b}`,
  "api.Providers.form.invaildFormtype": (a: string, b: string) => {
    `The type ${a} is not a valid type, Vaild types: ${JSON.stringify(b)}`;
  },
  "api.ChestGUI.error.pagenotfound": (a: string) => `Page ${a} not found!`,
  "modules.protections.cps.clickingToFast": () =>
    `You are clicking to fast! Please click slower!`,
  "modules.managers.mute.isMuted": () =>
    `You are muted and cannot send messages please try again later`,
  "modules.commands.ban.reply": (
    playerName: string,
    duration: string,
    reason: string = ""
  ) =>
    `§cBanned §f"§a${playerName}§f" §cfor ${length} Because: "${
      reason ?? "No reason Provided"
    }" §aSuccessfully`,
};
