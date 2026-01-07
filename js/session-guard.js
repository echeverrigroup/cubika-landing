import { supabase } from "./supabaseClient.js";

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 horas
let inactivityTimer;

function resetTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(forceLogout, SESSION_TIMEOUT);
}

async function forceLogout() {
  await supabase.auth.signOut();
  alert("Sesión cerrada por inactividad.");
  window.location.href = "/login.html";
}

// Eventos que cuentan como actividad
["click", "mousemove", "keydown", "scroll", "touchstart"].forEach((event) => {
  window.addEventListener(event, resetTimer);
});

// Inicializar temporizador
resetTimer();


supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    window.location.href = "/login.html";
  }
});
