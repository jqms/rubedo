import { BlockLocation, Player } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { db_regions } from "../index.js";

/**
 * @typedef {Object} regionDBJSON
 * @property {BlockLocation} from pos1 of region
 * @property {BlockLocation} to pos2 of the region
 * @property {String} name name of the region
 * @property {String} id the uniqueid of the region
 */

export class Region {
  /**
   * @returns {Array<Region>}
   */
  static getRegions() {
    /**
     * @type {Array<regionDBJSON>}
     */
    const regions = db_regions.get("AntiCheat:regions") ?? [];
    return regions.map(
      (region) =>
        new Region(
          new BlockLocation(region.from.x, region.from.y, region.from.z),
          new BlockLocation(region.to.x, region.to.y, region.to.z),
          region.name,
          region.id
        )
    );
  }
  static getRegionInBlockLocation(blockLocation) {}
  /**
   * Creates a new Region Instance
   * @param {BlockLocation} from pos1 of the region
   * @param {BlockLocation} to pos2 of the region
   * @param {String} name name of the region,
   * @param {String} id the uniqueid of the region
   */
  constructor(from, to, name = "Region", id = null) {
    this.from = from;
    this.to = to;
    this.name = name;
    this.id = id ? id : this.create();
  }

  /**
   * Creates this region and saves it into database
   * @returns {String} the unique id of this region
   */
  create() {
    const id = Date.now().toString();
    /**
     * @type {Array<regionDBJSON>}
     */
    const regions = db_regions.get("AntiCheat:regions") ?? [];
    regions.push({
      from: this.from,
      to: this.to,
      name: this.name,
      id: id,
    });
    db_regions.set("AntiCheat:regions", regions);
    return id;
  }
}
