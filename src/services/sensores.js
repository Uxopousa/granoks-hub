function createSensorService(io) {
  const timer = setInterval(() => {
    io.emit("sensores", {
      temperatura: +(70 + Math.random() * 10).toFixed(1),
      nivelGrano: +(Math.random() * 100).toFixed(1),
      timestamp: Date.now(),
    });
  }, 2000);

  function stop() {
    clearInterval(timer);
  }

  return { stop };
}

module.exports = { createSensorService };
