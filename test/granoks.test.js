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

  await new Promise((resolve) => instance.server.listen(0, resolve));

  return {
    baseUrl: `http://127.0.0.1:${instance.server.address().port}`,
    async close() {
      await instance.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    },
  };
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  return { status: res.status, data };
}

test("GET /api/promos retorna promos sembradas", async () => {
  const server = await startTestServer();
  try {
    const { status, data } = await fetchJson(`${server.baseUrl}/api/promos`);
    assert.equal(status, 200);
    assert.equal(data.length, 3);
  } finally {
    await server.close();
  }
});

test("POST /api/pedidos rechaza datos invalidos", async () => {
  const server = await startTestServer();
  try {
    const { status, data } = await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [], username: "" }),
    });
    assert.equal(status, 400);
    assert.equal(data.error, "Username requerido");
  } finally {
    await server.close();
  }
});

test("crear pedido suma puntos y permite canjear promo", async () => {
  const server = await startTestServer();
  try {
    const created = await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Americano", precio: 3.5 }], username: "tester" }),
    });
    assert.equal(created.status, 201);
    assert.equal(created.data.puntos, 50);

    const redeemed = await fetchJson(`${server.baseUrl}/api/promos/1/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "tester" }),
    });
    assert.equal(redeemed.status, 200);
    assert.equal(redeemed.data.puntos, 0);
  } finally {
    await server.close();
  }
});

test("GET /api/pedidos/resumen retorna totales correctos", async () => {
  const server = await startTestServer();
  try {
    const vacio = await fetchJson(`${server.baseUrl}/api/pedidos/resumen`);
    assert.equal(vacio.status, 200);
    assert.equal(vacio.data.total_pedidos, 0);
    assert.equal(vacio.data.total_ingresos, 0);

    await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Latte", precio: 4.0 }], username: "sum-test" }),
    });
    await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Te", precio: 2.0 }], username: "sum-test" }),
    });

    const { data } = await fetchJson(`${server.baseUrl}/api/pedidos/resumen`);
    assert.equal(data.total_pedidos, 2);
    assert.equal(data.total_ingresos, 6);
    assert.equal(data.promedio_pedido, 3);
  } finally {
    await server.close();
  }
});

test("crear pedido registra movimientos en ledger", async () => {
  const server = await startTestServer();
  try {
    await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Latte", precio: 4.5 }], username: "ledger-test" }),
    });

    const { status, data } = await fetchJson(`${server.baseUrl}/api/movimientos?usuario=ledger-test`);
    assert.equal(status, 200);
    assert.ok(data.length >= 2);

    const tipos = data.map((m) => m.tipo);
    assert.ok(tipos.includes("pedido_creado"));
    assert.ok(tipos.includes("puntos_sumados"));
  } finally {
    await server.close();
  }
});

test("canje de promo registra movimiento", async () => {
  const server = await startTestServer();
  try {
    await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Capuchino", precio: 3.0 }], username: "canje-test" }),
    });

    await fetchJson(`${server.baseUrl}/api/promos/1/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "canje-test" }),
    });

    const { data } = await fetchJson(`${server.baseUrl}/api/movimientos?usuario=canje-test`);
    const tipos = data.map((m) => m.tipo);
    assert.ok(tipos.includes("promo_canjeada"));
    assert.ok(tipos.includes("puntos_restados"));
  } finally {
    await server.close();
  }
});

test("GET /api/pedidos filtra por usuario", async () => {
  const server = await startTestServer();
  try {
    await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Te", precio: 2.0 }], username: "filtro-a" }),
    });
    await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Cafe", precio: 2.5 }], username: "filtro-b" }),
    });

    const { data } = await fetchJson(`${server.baseUrl}/api/pedidos?usuario=filtro-a`);
    assert.equal(data.length, 1);
    assert.equal(data[0].producto, "Te");
  } finally {
    await server.close();
  }
});

test("GET /api/pedidos filtra por rango de fechas", async () => {
  const server = await startTestServer();
  try {
    await fetchJson(`${server.baseUrl}/api/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ producto: "Expresso", precio: 2.0 }], username: "rango-test" }),
    });

    const hoy = new Date().toISOString().slice(0, 10);
    const { data } = await fetchJson(`${server.baseUrl}/api/pedidos?desde=${hoy}&hasta=${hoy}`);
    assert.ok(data.length >= 1);
  } finally {
    await server.close();
  }
});

test("GET /api/movimientos sin usuario retorna todo", async () => {
  const server = await startTestServer();
  try {
    const { status, data } = await fetchJson(`${server.baseUrl}/api/movimientos`);
    assert.equal(status, 200);
    assert.ok(Array.isArray(data));
  } finally {
    await server.close();
  }
});
