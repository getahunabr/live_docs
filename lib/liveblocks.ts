import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
  secret:
    "sk_dev_R2IciwLM8TGe07RVDyDEjg9uWa6hUuj5WchlZT-J9qGDjLoXTSJ-iCTbZ_7jAjm-",
});
console.log("Liveblocks Secret Key:", process.env.LIVEBLOCKS_SECRET_KEY);
