import { DEFAULT_REGION_PERMISSIONS } from "../../config/region";
import { TABLES } from "../../index.js";
import { loadRegionDenys } from "../../utils.js";
/**
 * Holds all regions in memory so its not grabbing them so much
 */
export const REGIONS = [];
/**
 * If the regions have been grabbed if not it will grab them and set this to true
 */
let REGIONS_HAVE_BEEN_GRABBED = false;
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
 * @param XYZa The first set of numbers
 * @param XYZb The second set of numbers
 * @param XYZc The set of numbers that should between the first and second set of numbers
 * @example betweenXYZ([1, 0, 1], [22, 81, 10], [19, 40, 6]));
 */
function betweenXYZ(XYZa, XYZb, XYZc) {
    return XYZc.every((c, i) => c >= Math.min(XYZa[i], XYZb[i]) && c <= Math.max(XYZa[i], XYZb[i]));
}
export class Region {
    /**
     * Creates a new Region to store in db
     */
    constructor(from, to, dimensionId, permissions, key) {
        this.from = from;
        this.to = to;
        this.dimensionId = dimensionId;
        this.permissions = permissions ?? DEFAULT_REGION_PERMISSIONS;
        this.key = key ? key : Date.now().toString();
        if (!key) {
            this.update();
            loadRegionDenys();
            REGIONS.push(this);
        }
    }
    /**
     * Gets all regions
     */
    static getAllRegions() {
        if (REGIONS_HAVE_BEEN_GRABBED)
            return REGIONS;
        const regions = TABLES.regions
            .values()
            .map((region) => new Region(region.from, region.to, region.dimensionId, region.permissions, region.key));
        regions.forEach((r) => {
            REGIONS.push(r);
        });
        return regions;
    }
    /**
     * Checks if a block location is in region
     */
    static blockLocationInRegion(blockLocation, dimensionId) {
        return this.getAllRegions().find((region) => region.dimensionId == dimensionId &&
            betweenXYZ([region.from.x, LOWEST_Y_VALUE, region.from.z], [region.to.x, HIGEST_Y_VALUE, region.to.z], [blockLocation.x, blockLocation.y, blockLocation.z]));
    }
    /**
     * Removes a region at a block Location
     * @param dimensionId the id of this dimension
     * @returns if the region was removed or not
     */
    static removeRegionAtBlockLocation(blockLocation, dimensionId) {
        const region = this.blockLocationInRegion(blockLocation, dimensionId);
        if (!region)
            return false;
        return TABLES.regions.delete(region.key);
    }
    /**
     * Updates this region in the database
     */
    update() {
        TABLES.regions.set(this.key, {
            key: this.key,
            from: this.from,
            dimensionId: this.dimensionId,
            permissions: this.permissions,
            to: this.to,
        });
    }
    /**
     * removes this region
     * @returns if the region was removed succesfully
     */
    delete() {
        return TABLES.regions.delete(this.key);
    }
    /**
     * Checks if a player is in this region
     * @returns if a entity is in this region or not
     */
    entityInRegion(entity) {
        return (this.dimensionId == entity.dimension.id &&
            betweenXYZ([this.from.x, LOWEST_Y_VALUE, this.from.z], [this.to.x, HIGEST_Y_VALUE, this.to.z], [entity.location.x, entity.location.y, entity.location.z]));
    }
    /**
     * Changes a permission to on or off
     */
    changePermission(key, value) {
        this.permissions[key] = value;
        this.update();
    }
}
