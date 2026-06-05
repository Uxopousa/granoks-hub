injectNav("POS");
const socket = io();
const uInput = document.getElementById("uInput");
const puntos = document.getElementById("puntosDisplay");
const promos = document.getElementById("promos");

async function cargarPedidos() {
  const response = await fetch("/api/pedidos");
  const pedidos = await response.json();
  renderTable(pedidos, [
    { key: "id", label: "ID" },
    { key: "producto", label: "Producto" },
    { key: "total", label: "Total" },
    { key: "usuario_username", label: "Usuario" },
    { key: "created_at", label: "Fecha" }
  ], "tb");
}

async function cargarUsuario() {
  const username = uInput.value.trim();
  if (!username) {
    puntos.textContent = "";
    return null;
  }

  const response = await fetch("/api/usuarios/" + encodeURIComponent(username));
  if (!response.ok) {
    puntos.textContent = "";
    return null;
  }

  const user = await response.json();
  puntos.textContent = "Puntos: " + user.puntos;
  return user;
}

async function cargarPromos() {
  const response = await fetch("/api/promos");
  const lista = await response.json();
  promos.innerHTML = lista.length
    ? lista.map(promo => "<div class='promo'><div><strong>" + promo.descripcion + "</strong><div class=muted>Coste: " + promo.coste_puntos + " puntos</div></div><button data-id='" + promo.id + "'>Canjear</button></div>").join("")
    : "<p class=muted>No hay promociones.</p>";

  promos.querySelectorAll("button[data-id]").forEach(button => {
    button.onclick = () => canjearPromo(button.dataset.id);
  });
}

async function canjearPromo(id) {
  const username = uInput.value.trim();
  if (!username) {
    showToast("Introduce un usuario", "error");
    return;
  }

  const response = await fetch("/api/promos/" + id + "/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  const result = await response.json();

  if (!response.ok) {
    showToast(result.error || "No se pudo canjear la promo", "error");
    return;
  }

  await cargarUsuario();
  await cargarPromos();
  showToast(result.message + ". Puntos restantes: " + result.puntos, "success");
}

document.getElementById("uBtn").onclick = cargarUsuario;
uInput.addEventListener("change", cargarUsuario);

document.getElementById("pf").onsubmit = async function(event) {
  event.preventDefault();
  const form = new FormData(this);
  const username = String(form.get("username") || "").trim();
  const response = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto: form.get("producto"), total: +form.get("total"), username })
  });

  if (!response.ok) {
    const result = await response.json();
    showToast(result.error || "No se pudo crear el pedido", "error");
    return;
  }

  this.reset();
  uInput.value = username;
  showToast("Pedido creado", "success");
  await cargarPedidos();
  await cargarPromos();
  await cargarUsuario();
};

socket.on("nuevo-pedido", async () => {
  await cargarPedidos();
  await cargarUsuario();
});

cargarUsuario();
cargarPedidos();
cargarPromos();