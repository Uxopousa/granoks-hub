injectNav();
var lookupTimer;

var socket = io();
var uInput = document.getElementById("uInput");
var puntos = document.getElementById("puntosDisplay");
var promos = document.getElementById("promos");

async function cargarPedidos() {
  var response = await fetch("/api/pedidos");
  var pedidos = await response.json();
  renderTable(pedidos, [
    { key: "id", label: "ID" },
    { key: "producto", label: "Producto" },
    { key: "total", label: "Total" },
    { key: "usuario_username", label: "Usuario" },
    { key: "created_at", label: "Fecha" }
  ], "tb");
}

async function cargarUsuario() {
  var username = uInput.value.trim();
  if (!username) {
    puntos.textContent = "";
    return null;
  }

  var response = await fetch("/api/usuarios/" + encodeURIComponent(username));
  if (!response.ok) {
    puntos.textContent = "";
    return null;
  }

  var user = await response.json();
  puntos.textContent = user.puntos;
  return user;
}

function lookupDebounced() {
  clearTimeout(lookupTimer);
  lookupTimer = setTimeout(cargarUsuario, 250);
}

async function cargarPromos() {
  var response = await fetch("/api/promos");
  var lista = await response.json();
  promos.innerHTML = lista.length
    ? lista.map(function (p) {
        return "<div class='promo'><div><strong>" + p.descripcion + "</strong><div class=muted>" + p.coste_puntos + "</div></div><button data-id='" + p.id + "'>Canjear</button></div>";
      }).join("")
    : "<p class=muted>No hay promociones.</p>";

  promos.querySelectorAll("button[data-id]").forEach(function (btn) {
    btn.onclick = function () { canjearPromo(btn.dataset.id); };
  });
}

async function canjearPromo(id) {
  var username = uInput.value.trim();
  if (!username) {
    showToast("Escribe un cliente", "error");
    return;
  }

  var response = await fetch("/api/promos/" + id + "/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username })
  });
  var result = await response.json();

  if (!response.ok) {
    showToast(result.error || "No se pudo canjear", "error");
    return;
  }

  await cargarUsuario();
  await cargarPromos();
  showToast("Promo canjeada. Saldo: " + result.puntos, "success");
}

uInput.addEventListener("input", lookupDebounced);

document.getElementById("pf").onsubmit = async function (event) {
  event.preventDefault();
  var form = new FormData(this);
  var username = uInput.value.trim();
  if (!username) { showToast("Escribe un cliente", "error"); return; }
  var response = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto: form.get("producto"), total: +form.get("total"), username: username })
  });

  if (!response.ok) {
    var result = await response.json();
    showToast(result.error || "No se pudo crear", "error");
    return;
  }

  var data = await response.json();
  this.reset();
  uInput.value = username;
  showToast("Pedido creado. " + username + ": " + data.puntos + " pts", "success");
  await cargarPedidos();
  await cargarPromos();
  await cargarUsuario();
};

socket.on("nuevo-pedido", async function () {
  await cargarPedidos();
  await cargarUsuario();
});

cargarPedidos();
cargarPromos();