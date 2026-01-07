import { supabase } from "./js/supabaseClient.js";

const form = document.getElementById("loginForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  result.textContent = "Iniciando sesión...";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    result.textContent = error.message;
    return;
  }

  await postLoginRedirect();
});

async function postLoginRedirect() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    result.textContent = "Error de sesión.";
    return;
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select(`
      onboarding_completed,
      roles ( code )
    `)
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    result.textContent = "Error de perfil. Contacta soporte.";
    await supabase.auth.signOut();
    return;
  }

  // 🔁 Onboarding incompleto
  if (!profile.onboarding_completed) {
    window.location.href = "/onboarding.html";
    return;
  }

  // 🔐 Redirección por rol
  switch (profile.roles.code) {
    case "SUPER_ADMIN":
      window.location.href = "/admin/companies.html";
      break;

    case "ADMIN_EMPRESA":
      window.location.href = "/uploads-history.html";
      break;

    default:
      result.textContent = "Rol no autorizado.";
      await supabase.auth.signOut();
  }
}
