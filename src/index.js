const http = require("http");
const PORT = 3000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };
const heroFactory = require("./factories/heroFactory");
const heroService = heroFactory.generateInstance();
const hero = require("./entities/hero");

const routes = {
  "/heroes:get": async (request, response) => {
    const { id } = request.queryString;
    const heroes = await heroService.find(id);
    response.write(JSON.stringify({ results: heroes }));
    return response.end();
  },
  "/heroes:post": async (request, response) => {
    // async iterator
    for await (const data of request) {
      try {
        const item = JSON.parse(data);
        const hero = new hero(item);
        const { error, valid } = hero.isValid();
        if (!valid) {
          response.writeHead(400, DEFAULT_HEADER);
          response.write(JSON.stringify({ error: error.join(", ") }));
          return response.end();
        }
        const id = await heroService.create(hero);
        response.writeHead(201, DEFAULT_HEADER);
        response.write(
          JSON.stringify({ success: "Hero created with success.", id })
        );
        // só jogamos o return pois sabemos que é somente um objeto por vez
        // se fosse carregar em bloco, removeriamos
        return response.end();
      } catch (error) {
        return handleError(response)(error);
      }
    }
  },
  default: (request, response) => {
    response.write("Error");
    response.end();
  },
};

const handleError = (response) => {
  return (error) => {
    console.error("Error:", error);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: "Internal Server Error!" }));

    return response.end();
  };
};

const handler = (request, response) => {
  const { url, method } = request;

  const [first, route, id] = url.split("/");

  request.queryString = { id: isNaN(id) ? id : Number(id) };

  const key = `/${route}:${method.toLowerCase()}`;

  response.writeHead(200, DEFAULT_HEADER);

  const chosen = routes[key] || routes.default;
  return chosen(request, response).catch(handleError(response));
};

http
  .createServer(handler)
  .listen(PORT, () => console.log("server running at", PORT));
