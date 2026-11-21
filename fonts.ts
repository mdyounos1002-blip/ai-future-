import {loadFont} from "@remotion/google-fonts/NotoSansBengali";

const loaded = loadFont("normal", {weights: ["500", "700", "800"], subsets: ["bengali", "latin"]});
export const fontFamily = loaded.fontFamily;
