/*
|--------------------------------------------------------------------------
| Autoload Modules
|--------------------------------------------------------------------------
|
| This file is for loading the anti cheat modules, once a new one is added
| It gets added on this list below, You can manually remove them from that
| List if you dont want them activated
| 
*/

/**
 * An array of file names that are getting imported
 */
export const Modules = [
  "cbe",
  "crasher",
  "fly",
  "gamemode",
  "nameSpoof",
  "nuker",
  "place",
  "reach",
  "cps",
  "killaura"
];

for (const module of Modules) {
  const start = Date.now();
  import(`./${module}.js`)
    .then(() => {
      console.warn(
        `Loaded Module: ${module} Successfully, in ${Date.now() - start} ms`
      );
    })
    .catch((error) => {
      console.warn(`Error on Loading Module ${plugin}: ` + error + error.stack);
    });
}
