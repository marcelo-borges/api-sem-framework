const heroRepository = require("./../repositories/heroRepository");
const heroService = require("./../services/heroService");

const { join } = require("path");
const filename = join(__dirname, "../../database", "data.json");

const generateInstance = () => {
  const heroRepository = new heroRepository({
    file: filename,
  });
  const heroService = new heroService({
    heroRepository,
  });
  return heroService;
};

module.exports = { generateInstance };
