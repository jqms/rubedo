import { fetch } from "./utils.js";
class DefaultType {
}
DefaultType.fail = "commands.generic.parameter.invalid";
DefaultType.validate = (value) => value && value != "";
DefaultType.parse = (value) => value;
class IntegerOption {
}
IntegerOption.fail = "commands.generic.num.invalid";
IntegerOption.validate = (value) => !isNaN(value);
IntegerOption.parse = (value) => parseInt(value);
class FloatOption {
}
FloatOption.fail = IntegerOption.fail;
FloatOption.validate = (value) => value?.match(/^\d+\.\d+$/)?.[0];
FloatOption.parse = (value) => parseFloat(value);
class LocationOption {
}
LocationOption.fail = IntegerOption.fail;
LocationOption.validate = (value) => value?.match(/^([\~\^]{1})?([-]?\d*)$/)?.[0];
LocationOption.parse = (value) => value;
class BooleanOption {
}
BooleanOption.fail = "commands.generic.boolean.invalid";
BooleanOption.validate = (value) => value?.match(/^(true|false)$/)?.[0];
BooleanOption.parse = (value) => (value == "true" ? true : false);
class PlayerOption {
}
PlayerOption.fail = "commands.generic.player.notFound";
PlayerOption.validate = (value) => (fetch(value) ? true : false);
PlayerOption.parse = (value) => fetch(value);
class TargetOption {
}
TargetOption.fail = "commands.generic.player.notFound";
TargetOption.validate = (value) => value?.match(/^(@.|"[\s\S]+")$/)?.[0];
TargetOption.parse = (value) => value;
class ArrayOption {
}
ArrayOption.fail = "commands.generic.parameter.invalid";
ArrayOption.validate = (value, types) => types.includes(value);
ArrayOption.parse = (value) => value;
export const OptionTypes = {
    string: DefaultType,
    int: IntegerOption,
    float: FloatOption,
    location: LocationOption,
    boolean: BooleanOption,
    player: PlayerOption,
    target: TargetOption,
    array: ArrayOption,
};
