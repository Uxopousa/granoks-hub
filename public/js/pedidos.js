injectNav();
var lookupTimer;
var catActual = null;

var socket = io();
var uInput = document.getElementById("uInput");
var puntos = document.getElementById("puntosDisplay");
var promos = document.getElementById("promos");
var items = [];

async function cargarCategorias() {
  var res = await fetch("/api/categorias");
  var cats = await res.json();
  var html = '<button class=cat-tab data-id="">Todo</button>';
  for (var i = 0; i < cats.length; i++) {
    html += '<button class=cat-tab data-id="' + cats[i].id + '">' + cats[i].nombre + "</button>";
  }
  document.getElementById("catTabs").innerHTML = html;
  document.getElementById("catTabs").addEventListener("click", function (e) {
    var btn = e.target.closest(".cat-tab");
    if (!btn) return;
    document.querySelectorAll(".cat-tab").forEach(function (t) { t.classList.remove("active"); });
    btn.classList.add("active");
    catActual = btn.dataset.id || null;
    cargarProductos(catActual);
  });
  document.querySelector('.cat-tab[data-id=""]').classList.add("active");
}

async function cargarProductos(categoriaId) {
  var url = "/api/productos";
  if (categoriaId) url += "?categoria_id=" + categoriaId;
  var res = await fetch(url);
  var prods = await res.json();
  var html = "";
  for (var i = 0; i < prods.length; i++) {
    var p = prods[i];
    html += '<button class=prod-btn data-nombre="' + p.nombre + '" data-precio="' + p.precio + '">' +
      '<span class=prod-nombre>' + p.nombre + "</span>" +
      '<span class=prod-precio>\u20AC' + p.precio.toFixed(2) + "</span></button>";
  }
  document.getElementById("prodGrid").innerHTML = html;
  document.getElementById("prodGrid").addEventListener("click", function (e) {
    var btn = e.target.closest(".prod-btn");
    if (!btn) return;
    items.push({ producto: btn.dataset.nombre, precio: +btn.dataset.precio });
    renderItemsList();
  });
}

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

function renderItemsList() {
  var total = 0;
  var html = "";
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    total += it.precio;
    html += '<div class=item-row><span class=item-nombre>' + it.producto + '</span><span class=item-precio>\u20AC' + it.precio.toFixed(2) + '</span><button type=button class=item-remove data-idx="' + i + '">&times;</button></div>';
  }
  document.getElementById("itemsList").innerHTML = html;
  document.getElementById("totalDisplay").textContent = "\u20AC" + total.toFixed(2);
  var btns = document.querySelectorAll(".item-remove");
  for (var j = 0; j < btns.length; j++) {
    btns[j].onclick = function () {
      items.splice(+this.dataset.idx, 1);
      renderItemsList();
    };
  }
}

uInput.addEventListener("input", lookupDebounced);

document.getElementById("pf").onsubmit = async function (event) {
  event.preventDefault();
  var username = uInput.value.trim();
  if (!username) { showToast("Escribe un cliente", "error"); return; }
  if (items.length === 0) { showToast("Agrega productos al pedido", "error"); return; }
  var response = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: items, username: username })
  });

  if (!response.ok) {
    var result = await response.json();
    showToast(result.error || "No se pudo crear", "error");
    return;
  }

  var data = await response.json();
  items = [];
  renderItemsList();
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

cargarCategorias();
cargarProductos(null);
cargarPedidos();
cargarPromos();