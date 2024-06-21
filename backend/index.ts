Bun.serve({
  port: 8002,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response("Home page!");
    if (url.pathname === "/blog") return new Response("Blog!");
    if (url.pathname == "/json") {
      const origin = req.headers.get("origin") || "";
      let allowedOrigin = "http://localhost:5173";
      if (origin.includes("192.168.1") || origin.includes("localhost")) {
        allowedOrigin = origin;
      }
      return new Response(JSON.stringify({ message: "Hello, World!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      });
    }
    return new Response("404!");
  },
});
