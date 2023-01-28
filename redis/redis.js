const Redis = require("ioredis");

const redis = new Redis({
  host: "redis-18755.c305.ap-south-1-1.ec2.cloud.redislabs.com",
  port: 18755,
  password: "KyTMVdGJUXMe8pEl6HC6jX989WJ2uyOZ",
});

redis.set("mykey", "value");

redis.get("mykey", (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Prints "value"
  }
});