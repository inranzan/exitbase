import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        // Shield protects your app from common attacks such as SQL injection
        shield({ mode: "LIVE" }),

        // Create a bot detection rule
        detectBot({
            mode: "LIVE", // Blocks requests.
            allow: [
                "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
            ],
        }),

        slidingWindow({
            mode: "LIVE",
            interval: 60,
            max: 100,
        }),
    ],
});

export default aj;
