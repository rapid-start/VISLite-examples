export default function (option, defaultOption) {
    for (const key in option) {
        defaultOption[key] = option[key];
    }

    return defaultOption;
};