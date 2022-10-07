import { DIMENSIONS } from "../../utils";
export function chunkString(str, length) {
    return str.match(new RegExp(".{1," + length + "}", "g"));
}
export function runCommand(command, dimension = "overworld") {
    try {
        DIMENSIONS[dimension].runCommand(command);
    }
    catch (error) { }
}
export function textToBinary(text) {
    return text
        .split("")
        .map((char) => {
        return char.charCodeAt(0).toString(2);
    })
        .join(" ");
}
export function binaryToText(binary) {
    return binary
        .split(" ")
        .map((char) => {
        return String.fromCharCode(parseInt(char, 2));
    })
        .join("");
}
