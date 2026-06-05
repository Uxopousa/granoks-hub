injectNav("Dashboard");
const sensorLabels = [];
const sensorTemperatures = [];
const sensorGrains = [];

const temperatureChart = new Chart(document.getElementById("tChart"), {
  type: "line",
  data: { labels: sensorLabels, datasets: [{ label: "Temperatura", data: sensorTemperatures, borderColor: "orange", tension: 0.3 }] },
  options: { responsive: true, animation: false, scales: { x: { display: false } } }
});

const grainChart = new Chart(document.getElementById("gChart"), {
  type: "line",
  data: { labels: sensorLabels, datasets: [{ label: "Nivel grano", data: sensorGrains, borderColor: "green", tension: 0.3 }] },
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

async function cargarPuntos() {
  const username = document.getElementById("uInput").value.trim();
  if (!username) return;

  const response = await fetch("/api/usuarios/" + encodeURIComponent(username));
  if (!response.ok) return;

  const user = await response.json();
  getPuntosEl().textContent = "Puntos: " + user.puntos;
}

document.getElementById("uBtn").onclick = cargarPuntos;
cargarPuntos();

async function cargarPedidos() {
  const response = await fetch("/api/pedidos");
  const pedidos = await response.json();
  document.getElementById("pedidos").innerHTML = "<p>" + pedidos.length + " pedidos</p>";
}

socket.on("nuevo-pedido", async () => {
  await cargarPuntos();
  await cargarPedidos();
});

cargarPedidos();