const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { createGranoksServer } = require("../src/granoks");

async function startTestServer() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "granoks-hub-"));
  const dbPath = path.join(tempDir, "test.db");
  const instance = createGranoksServer({ dbPath });

  await new Promise(resolve => instance.server.listen(0, resolve));

  return {
    baseUrl: `http://127.0.0.1:${instance.server.address().port}`,
    async close() {
      await instance.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  };
}

test("GET /api/promos retorna promos sembradas", async () => {
  const server = await startTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/promos`);
    assert.equal(response.status, 200);

    const promos = await response.json();
    assert.equal(promos.length, 3);
  } finally {
    await server.close();
  }
});

test("POST /api/pedidos rechaza datos invalidos", async () => {
  const server = await startTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto: "", total: 0, username: "" })
    });

    assert.equal(response.status, 400);

    const payload = await response.json();
    assert.equal(payload.error, "Datos de pedido invalidos");
  } finally {
    await server.close();
  }
});

test("crear pedido suma puntos y permite canjear promo", async () => {
  const server = await startTestServer();

  try {
    const createResponse = await fetch(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto: "Americano", total: 3.5, username: "tester" })
    });

    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();
    assert.equal(created.puntos, 50);

    const redeemResponse = await fetch(`${server.baseUrl}/api/promos/1/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "tester" })
    });

    assert.equal(redeemResponse.status, 200);
    const redeemed = await redeemResponse.json();
    assert.equal(redeemed.puntos, 0);
  } finally {
    await server.close();
  }
});
