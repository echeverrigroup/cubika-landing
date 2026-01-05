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

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    window.location.href = "/dashboard.html";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // 1️⃣ Validación básica
  if (password !== confirmPassword) {
    result.textContent = "Las contraseñas no coinciden";
    return;
  }

  result.textContent = "Creando contraseña…";

  // 2️⃣ 🔐 AQUÍ VA EXACTAMENTE ESTE BLOQUE
  const { error: passwordError } = await supabase.auth.updateUser({
    password,
  });

  if (passwordError) {
    result.textContent = `Error creando contraseña: ${passwordError.message}`;
    return;
  }

  result.textContent = "Guardando datos…";

  // 3️⃣ Completar perfil
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    result.textContent = `Error: ${error.message}`;
    return;
  }

  // 4️⃣ Fin del onboarding
  window.location.href = "/dashboard.html";
});

init();
