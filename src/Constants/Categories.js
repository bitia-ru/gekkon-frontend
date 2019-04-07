import * as R from "ramda";

export const CATEGORIES = [
    '1a', '1a+', '1b', '1b+', '1c', '1c+',
    '2a', '2a+', '2b', '2b+', '2c', '2c+',
    '3a', '3a+', '3b', '3b+', '3c', '3c+',
    '4a', '4a+', '4b', '4b+', '4c', '4c+',
    '5a', '5a+', '5b', '5b+', '5c', '5c+',
    '6a', '6a+', '6b', '6b+', '6c', '6c+',
    '7a', '7a+', '7b', '7b+', '7c', '7c+',
    '8a', '8a+', '8b', '8b+', '8c', '8c+',
    '9a', '9a+', '9b', '9b+', '9c', '9c+'
];

const COLORS = ['ffffff', 'ffe602', '48ff66', '7c81ff', 'eb002a', '141414'];

export const GetCategoryColor = (category) => {
    let index = R.findIndex((c) => c === category)(CATEGORIES);
    let colorIndex = parseInt(100 * index / (CATEGORIES.length - 1) / (100 / (COLORS.length - 1)), 10);
    if (colorIndex === COLORS.length - 1) {
        return COLORS[colorIndex];
    }
    let percentage = (100 * index / (CATEGORIES.length - 1) % (100 / (COLORS.length - 1))) / (100 / (COLORS.length - 1));
    let color1 = COLORS[colorIndex];
    let color2 = COLORS[colorIndex + 1];
    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
    let color = [
        (1 - percentage) * color1[0] + percentage * color2[0],
        (1 - percentage) * color1[1] + percentage * color2[1],
        (1 - percentage) * color1[2] + percentage * color2[2]
    ];
    return '#' + IntToHex(color[0]) + IntToHex(color[1]) + IntToHex(color[2]);
};

const IntToHex = (num) => {
    let hex = Math.round(num).toString(16);
    if (hex.length === 1)
        hex = '0' + hex;
    return hex;
};
