import { supabase } from "./js/supabaseClient.js";

const form = document.getElementById("onboardingForm");
const result = document.getElementById("result");

async function init() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    result.textContent = "Sesión inválida. Reingresa desde el email.";
    return;
  }

  // (opcional) Verificar si ya tiene full_name
  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (profile?.full_name) {
    window.location.href = "/dashboard.html";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;

  result.textContent = "Guardando datos...";

  const { error } = await supabase
    .from("users")
    .update({ full_name: fullName })
    .eq("id", (await supabase.auth.getUser()).data.user.id);

  if (error) {
    result.textContent = `Error: ${error.message}`;
    return;
  }

  result.textContent = "Registro completo ✔️";
  window.location.href = "/dashboard.html";
});

init();
