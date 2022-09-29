import { Timeout } from "./Timeout";
/**
 * Sleeps your code
 * @param {number} tick time in ticks you want the return to occur
 * @returns {Promise<void>}
 */
export const sleep = (tick) => {
    return new Promise((resolve) => setTickTimeout(resolve, tick));
};
/**
 * Register a tick timeout
 * @param callback Code you want to execute when the command is executed
 * @param tick time in ticks you want the return to occur
 */
export function setTickTimeout(callback, tick) {
    new Timeout(callback, tick);
}
/**
 * Delay executing a function, REPEATEDLY
 */
export function setTickInterval(callback, tick) {
    return new Timeout(callback, tick, true);
}
/**
 * Clears a interval
 */
export function clearTickInterval(callback) {
    callback.expire();
}
