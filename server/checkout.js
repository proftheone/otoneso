// Stripe Checkout endpoint for otoneso.com. Runs next to nginx in the same
// container; nginx proxies /api/ here (see nginx.conf.template).
const express = require("express");
const Stripe = require("stripe");

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const DOMAIN = process.env.DOMAIN || "https://otoneso.com";
// Consultation page per language; the button posts its language in `lang`.
const PAGES = { pl: "/doradztwo-srodowiskowe", en: "/environmental-consulting", de: "/umweltberatung" };

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post("/api/create-checkout-session", async (req, res) => {
  const lang = PAGES[req.body.lang] ? req.body.lang : "pl";
  const page = PAGES[lang];
  // Until Stripe is configured, send the visitor to the contact form instead of an error.
  if (!stripe || !process.env.STRIPE_CONSULT_PRICE_ID) return res.redirect(303, `${page}#start`);

  // One-time consultation, so mode is "payment" and payment_method_collection is not sent.
  const mode = "payment";
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "hosted_page",
      mode,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      submit_type: "auto",
      name_collection: {
        individual: { enabled: true, optional: true },
        business: { enabled: true, optional: true },
      },
      integration_identifier: "hosted_web_0001",
      origin_context: "web",
      locale: lang,
      success_url: `${DOMAIN}${page}?platnosc=ok&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}${page}`,
      line_items: [{ price: process.env.STRIPE_CONSULT_PRICE_ID, quantity: 1 }],
    });
    res.redirect(303, session.url);
  } catch (err) {
    console.error("Checkout session failed:", err.message);
    res.redirect(303, `${page}#start`);
  }
});

app.listen(process.env.CHECKOUT_PORT || 4242, "127.0.0.1", () => console.log("Checkout listening"));
