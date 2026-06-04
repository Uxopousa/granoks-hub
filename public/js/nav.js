function injectNav() {
  var nav = document.createElement("nav");
  nav.className = "nav-bar";
  nav.innerHTML =
    '<a class=nav-brand href=/>Granoks-Hub</a>' +
    '<div class=nav-links>' +
    '<a href=/>Dashboard</a>' +
    '<a href=/pedidos.html>Ventas</a>' +
    "</div>";
  document.body.prepend(nav);
}
