import { Timeout } from "./Timeout";
export const sleep = (tick) => {
    return new Promise((resolve) => setTickTimeout(resolve, tick));
};
export function setTickTimeout(callback, tick) {
    new Timeout(callback, tick);
}
export function setTickInterval(callback, tick) {
    return new Timeout(callback, tick, true);
}
export function clearTickInterval(callback) {
    callback.expire();
}
