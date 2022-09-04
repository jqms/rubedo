import { BlockLocation, Player, world } from "mojang-minecraft";
import { DEFAULT_REGION_PERMISSIONS } from "../config.js";
import { db_regions } from "../index.js";
import { loadRegionDenys } from "../utils.js";

/**
 * @typedef {Object} RegionCords
 * @property {Number} x the x cord
 * @property {Number} y the y cord
 */

/**
 * @typedef {Object} RegionPermissions
 * @property {Boolean} doorsAndSwitches if the player can use chests, defualt: true
 * @property {Boolean} openContainers if the player can use doors, default: true
 * @property {Boolean} pvp if players can fight, default: false
 */

/**
 * The Lowest Y value in minecraft
 */
const LOWEST_Y_VALUE = -64;

/**
 * The HIGEST Y value in minecraft
 */
const HIGEST_Y_VALUE = 320;

/**
 * Compare a array of numbers with 2 arrays
 * @param {[number, number, number]} XYZa The first set of numbers
 * @param {[number, number, number]} XYZb The second set of numbers
 * @param {[number, number, number]} XYZc The set of numbers that should between the first and second set of numbers
 * @example betweenXYZ([1, 0, 1], [22, 81, 10], [19, 40, 6]));
 * @returns {boolean}
 */
function betweenXYZ(XYZa, XYZb, XYZc) {
  return XYZc.every(
    (c, i) => c >= Math.min(XYZa[i], XYZb[i]) && c <= Math.max(XYZa[i], XYZb[i])
  );
}

export class Region {
  /**
   * Gets all regions
   * @returns {Array<Region>}
   */
  static getAllRegions() {
    return db_regions
      .values()
      .map(
        (region) =>
          new Region(
            region.from,
            region.to,
            region.dimension,
            region.permissions,
            region.key
          )
      );
  }

  /**
   * Checks if a block location is in region
   * @param {BlockLocation} blockLocation
   * @param {String} dimension the id of this dimension
   * @returns {Region | undefined} region it was in
   */
  static blockLocationInRegion(blockLocation, dimension) {
    return this.getAllRegions().find(
      (region) =>
        region.dimension == dimension &&
        betweenXYZ(
          [region.from.x, LOWEST_Y_VALUE, region.from.z],
          [region.to.x, HIGEST_Y_VALUE, region.to.z],
          [blockLocation.x, blockLocation.y, blockLocation.z]
        )
    );
  }

  /**
   * Removes a region at a block Location
   * @param {BlockLocation} blockLocation
   * @param {String} dimension the id of this dimension
   * @returns {Boolean} if the region was removed or not
   */
  static removeRegionAtBlockLocation(blockLocation, dimension) {
    const region = this.blockLocationInRegion(blockLocation, dimension);
    if (!region) return false;
    return db_regions.delete(region.key);
  }
  /**
   * Creates a new Region to store in db
   * @param {RegionCords} from
   * @param {RegionCords} to
   * @param {String} dimension dimesion this is in
   * @param {RegionPermissions} permissions permissions this region has
   * @param {*} key the key of this region if null creates new
   */
  constructor(from, to, dimension, permissions, key = null) {
    this.from = from;
    this.to = to;
    this.dimension = dimension;
    this.permissions = permissions ?? DEFAULT_REGION_PERMISSIONS;
    this.key = key ? key : Date.now().toString();

    if (!key) {
      this.update();
      loadRegionDenys();
    }
  }

  /**
   * Updates this region in the database
   */
  update() {
    db_regions.set(this.key, {
      key: this.key,
      from: this.from,
      dimension: this.dimension,
      permissions: this.permissions,
      to: this.to,
    });
  }

  /**
   * Checks if a player is in this region
   * @param {Player} player player to check
   * @returns {Boolean} if the player is in this region or not
   */
  playerInRegion(player) {
    return (
      this.dimension == player.dimension.id &&
      betweenXYZ(
        [this.from.x, LOWEST_Y_VALUE, this.from.z],
        [this.to.x, HIGEST_Y_VALUE, this.to.z],
        [player.location.x, player.location.y, player.location.z]
      )
    );
  }

  /**
   * Changes a permission to on or off
   * @param {doorsAndSwitches | openContainers | pvp} key a region key
   * @param {Boolean} value if this region is on or off
   */
  changePermission(key, value) {
    this.permissions[key] = value;
    this.update();
  }
}
