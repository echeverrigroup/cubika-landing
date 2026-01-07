import { supabase } from "./js/supabaseClient.js";

const form = document.getElementById("loginForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  result.textContent = "Iniciando sesión...";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    result.textContent = error.message;
    return;
  }

  // Usuario autenticado → evaluar estado
  await postLoginRedirect();
});

async function postLoginRedirect() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("users")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    result.textContent = "Error de perfil. Contacta soporte.";
    await supabase.auth.signOut();
    return;
  }

  if (!profile.onboarding_completed) {
    window.location.href = "/onboarding.html";
  } else {
    window.location.href = "/dashboard.html";
  }
}
