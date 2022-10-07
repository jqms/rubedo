import { DEFAULT_REGION_PERMISSIONS } from "../../config/region";
import { TABLES } from "../../index.js";
import { loadRegionDenys } from "../../utils.js";
export const REGIONS = [];
let REGIONS_HAVE_BEEN_GRABBED = false;
const LOWEST_Y_VALUE = -64;
const HIGEST_Y_VALUE = 320;
function betweenXYZ(XYZa, XYZb, XYZc) {
    return XYZc.every((c, i) => c >= Math.min(XYZa[i], XYZb[i]) && c <= Math.max(XYZa[i], XYZb[i]));
}
export class Region {
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
    static blockLocationInRegion(blockLocation, dimensionId) {
        return this.getAllRegions().find((region) => region.dimensionId == dimensionId &&
            betweenXYZ([region.from.x, LOWEST_Y_VALUE, region.from.z], [region.to.x, HIGEST_Y_VALUE, region.to.z], [blockLocation.x, blockLocation.y, blockLocation.z]));
    }
    static removeRegionAtBlockLocation(blockLocation, dimensionId) {
        const region = this.blockLocationInRegion(blockLocation, dimensionId);
        if (!region)
            return false;
        return TABLES.regions.delete(region.key);
    }
    update() {
        TABLES.regions.set(this.key, {
            key: this.key,
            from: this.from,
            dimensionId: this.dimensionId,
            permissions: this.permissions,
            to: this.to,
        });
    }
    delete() {
        return TABLES.regions.delete(this.key);
    }
    entityInRegion(entity) {
        return (this.dimensionId == entity.dimension.id &&
            betweenXYZ([this.from.x, LOWEST_Y_VALUE, this.from.z], [this.to.x, HIGEST_Y_VALUE, this.to.z], [entity.location.x, entity.location.y, entity.location.z]));
    }
    changePermission(key, value) {
        this.permissions[key] = value;
        this.update();
    }
}
