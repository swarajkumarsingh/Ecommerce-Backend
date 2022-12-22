module.exports.neatMongoose = function () {
  const obj = this.toObject();

  // Change _id to id
  obj["id"] = obj["_id"];

  // Remove Version and Id
  const fieldsToDelete = ["__v", "_id", "updatedAt"];
  for (const field of fieldsToDelete) {
    delete obj[field];
  }

  // Re format coordinates
  if (
    "location" in obj &&
    "type" in obj.location &&
    "coordinates" in obj.location &&
    Array.isArray(obj.location.coordinates) &&
    obj.location.coordinates.length > 1
  ) {
    obj.location = [obj.location.coordinates[1], obj.location.coordinates[0]];
  }
  return obj;
};

