function renderTable(data, columns, containerId) {
  var el = document.getElementById(containerId);
  if (!data || data.length === 0) {
    el.innerHTML = '<p class=muted>Sin datos.</p>';
    return;
  }
  var html = '<table><thead><tr>';
  for (var i = 0; i < columns.length; i++) {
    html += '<th>' + escapeHtml(columns[i].label) + '</th>';
  }
  html += '</tr></thead><tbody>';
  for (var r = 0; r < data.length; r++) {
    html += '<tr>';
    for (var c = 0; c < columns.length; c++) {
      var col = columns[c];
      var val = data[r][col.key];
      if (val == null) val = '';
      if (col.format) val = col.format(val, data[r]);
      html += '<td>' + escapeHtml(String(val)) + '</td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  el.innerHTML = html;
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
