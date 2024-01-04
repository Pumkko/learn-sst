import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler";
import { Config } from "sst/node/config";
import Stripe from "stripe";
import { calculateCost } from "@notes/core/cost"


export const handler = errorBoundariesHandler(async (event, context) => {
    const { storage, source } = JSON.parse(event.body ?? "{}");
    const amount = calculateCost(storage);
    const description = "Scratch charge";

    // Load our secret key
    const stripe = new Stripe(Config.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
    });

    await stripe.charges.create({
        source,
        amount,
        description,
        currency: "usd",
    });

    return {
        statusCode: 200
    }

})