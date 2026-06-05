function injectNav(pageTitle) {
  var nav = document.createElement("nav");
  nav.className = "nav-bar";
  nav.innerHTML =
    '<a class=nav-brand href=/>Granoks-Hub</a>' +
    '<div class=nav-links>' +
    '<a href=/>Dashboard</a>' +
    '<a href=/pedidos.html>POS</a>' +
    "</div>" +
    '<div class=nav-user>' +
    '<label>Usuario: <input id=uInput value=cliente1 size=10></label>' +
    '<button id=uBtn class=nav-btn>' + (pageTitle === "POS" ? "Actualizar puntos" : "Cargar") + "</button>" +
    '<strong id=puntosDisplay></strong>' +
    "</div>";
  document.body.prepend(nav);
}

function getPuntosEl() {
  return document.getElementById("puntosDisplay");
}
