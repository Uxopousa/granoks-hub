injectNav();
const sensorLabels = [];
const sensorTemperatures = [];
const sensorGrains = [];

const temperatureChart = new Chart(document.getElementById("tChart"), {
  type: "line",
  data: { labels: sensorLabels, datasets: [{ label: "Temperatura", data: sensorTemperatures, borderColor: "#c87a3e", backgroundColor: "rgba(200,122,62,0.1)", tension: 0.3 }] },
  options: { responsive: true, animation: false, scales: { x: { display: false } } }
});

const grainChart = new Chart(document.getElementById("gChart"), {
  type: "line",
  data: { labels: sensorLabels, datasets: [{ label: "Nivel grano", data: sensorGrains, borderColor: "#4a7c59", backgroundColor: "rgba(74,124,89,0.1)", tension: 0.3 }] },
  options: { responsive: true, animation: false, scales: { x: { display: false } } }
});

const socket = io();

socket.on("sensores", data => {
  document.getElementById("temp").textContent = data.temperatura + " C";
  document.getElementById("grano").textContent = data.nivelGrano + "%";

  if (sensorTemperatures.length > 20) {
    sensorTemperatures.shift();
    sensorGrains.shift();
    sensorLabels.shift();
  }

  sensorTemperatures.push(data.temperatura);
  sensorGrains.push(data.nivelGrano);
  sensorLabels.push("");
  temperatureChart.update();
  grainChart.update();
});

async function cargarResumen() {
  const response = await fetch("/api/pedidos/resumen");
  const r = await response.json();
  const container = document.getElementById("resumen");
  container.textContent = "";
  const items = [
    { valor: r.total_pedidos, label: "Pedidos" },
    { valor: "\u20AC" + Number(r.total_ingresos).toFixed(2), label: "Ingresos" },
    { valor: "\u20AC" + Number(r.promedio_pedido).toFixed(2), label: "Promedio" },
  ];
  for (const item of items) {
    const div = document.createElement("div");
    div.className = "resumen-item";
    const valor = document.createElement("div");
    valor.className = "resumen-valor";
    valor.textContent = item.valor;
    const label = document.createElement("div");
    label.className = "resumen-label";
    label.textContent = item.label;
    div.appendChild(valor);
    div.appendChild(label);
    container.appendChild(div);
  }
}

async function cargarPedidos() {
  const response = await fetch("/api/pedidos");
  const pedidos = await response.json();
  renderTable(pedidos, [
    { key: "id", label: "ID" },
    { key: "producto", label: "Producto" },
    { key: "total", label: "Total" },
    { key: "usuario_username", label: "Usuario" },
    { key: "created_at", label: "Fecha" }
  ], "pedidos");
}

socket.on("nuevo-pedido", async () => {
  await cargarResumen();
  await cargarPedidos();
});

cargarResumen();
cargarPedidos();