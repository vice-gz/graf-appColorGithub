const clamp = (v, min = 0, max = 255) => Math.min(max, Math.max(min, Number(v) || 0));
const toHex2 = (v) => clamp(v).toString(16).padStart(2, "0").toUpperCase();

function updateUI(r, g, b) {
  const colorBox = document.getElementById("colorBox");
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  colorBox.style.backgroundColor = rgbString;

  const hex = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
  document.getElementById("hexValue").value = hex;
  document.getElementById("rgbValue").value = rgbString;

  document.getElementById("rBadge").textContent = r;
  document.getElementById("gBadge").textContent = g;
  document.getElementById("bBadge").textContent = b;

  document.getElementById("rgbInput").value = `${r},${g},${b}`;
}

function getValues() {
  return {
    r: clamp(document.getElementById("rNumber").value),
    g: clamp(document.getElementById("gNumber").value),
    b: clamp(document.getElementById("bNumber").value),
  };
}

function syncPair(channel, value) {
  const range = document.getElementById(channel + "Range");
  const number = document.getElementById(channel + "Number");
  const v = clamp(value);
  range.value = v;
  number.value = v;
}

function init() {
  // Configurar listeners para range y number de cada canal
  ["r", "g", "b"].forEach((ch) => {
    const range = document.getElementById(ch + "Range");
    const number = document.getElementById(ch + "Number");

    range.addEventListener("input", (e) => {
      syncPair(ch, e.target.value);
      const { r, g, b } = getValues();
      updateUI(r, g, b);
    });

    number.addEventListener("input", (e) => {
      syncPair(ch, e.target.value);
      const { r, g, b } = getValues();
      updateUI(r, g, b);
    });
  });

  // Listener para el input RGB
  document.getElementById("rgbInput").addEventListener("input", (e) => {
    const value = e.target.value;
    const rgb = value.split(",").map(v => clamp(v.trim()));
    if (rgb.length === 3 && rgb.every(v => !isNaN(v))) {
      syncPair("r", rgb[0]);
      syncPair("g", rgb[1]);
      syncPair("b", rgb[2]);
      updateUI(rgb[0], rgb[1], rgb[2]);
    }
  });

  // Botón Reiniciar
  document.getElementById("resetBtn").addEventListener("click", () => {
    ["r", "g", "b"].forEach((ch) => syncPair(ch, 0));
    updateUI(0, 0, 0);
  });

  // Copiar HEX al portapapeles
  document.getElementById("copyHexBtn").addEventListener("click", async () => {
    const input = document.getElementById("hexValue");
    try {
      await navigator.clipboard.writeText(input.value);
      if (window.bootstrap && window.bootstrap.Toast) {
        const toastContainer = document.getElementById("toastContainer");
        const toast = document.createElement("div");
        toast.className = "toast align-items-center text-bg-primary border-0";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.setAttribute("aria-atomic", "true");
        toast.innerHTML = `
          <div class="d-flex">
            <div class="toast-body">HEX copiado: ${input.value}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>`;
        toastContainer.appendChild(toast);
        const t = new bootstrap.Toast(toast, { delay: 1500 });
        t.show();
        setTimeout(() => toast.remove(), 1800);
      } else {
        alert("HEX copiado: " + input.value);
      }
    } catch (err) {
      alert("No se pudo copiar el HEX.");
    }
  });

  // Inicializar con valores por defecto
  updateUI(0, 0, 0);
}

document.addEventListener("DOMContentLoaded", init);