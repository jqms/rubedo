import { world } from "mojang-minecraft";
/**
 * Splits a string into chunk sizes
 */
export function chunkString(str, length) {
    return str.match(new RegExp(".{1," + length + "}", "g"));
}
/**
 * Runs a Command
 * @example runCommand(`say test`)
 */
export function runCommand(command, dimension = "overworld") {
    try {
        world.getDimension(dimension).runCommand(command);
    }
    catch (error) { }
}
/**
 * Convert string to binary
 */
export function textToBinary(text) {
    return text
        .split("")
        .map((char) => {
        return char.charCodeAt(0).toString(2);
    })
        .join(" ");
}
/**
 * Convert binary to string
 */
export function binaryToText(binary) {
    return binary
        .split(" ")
        .map((char) => {
        return String.fromCharCode(parseInt(char, 2));
    })
        .join("");
}
