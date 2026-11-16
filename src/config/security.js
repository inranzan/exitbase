import arcjet, { shield, slidingWindow } from "@arcjet/node";

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        // Shield protects your app from common attacks such as SQL injection
        shield({ mode: "LIVE" }),

        slidingWindow({
            mode: "LIVE",
            interval: 60,
            max: 100,
        }),
    ],
});

export default aj;
