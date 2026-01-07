import { supabase } from "./js/supabaseClient.js";

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("loginError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.style.display = "none";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await postLoginRedirect();
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.style.display = "block";
  }
});

async function postLoginRedirect() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesión inválida");

  const { data: profile, error } = await supabase
    .from("users")
    .select(`
      onboarding_completed,
      roles ( code )
    `)
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    await supabase.auth.signOut();
    throw new Error("Error de perfil. Contacta soporte.");
  }

  if (!profile.onboarding_completed) {
    window.location.href = "/onboarding.html";
    return;
  }

  switch (profile.roles.code) {
    case "SUPER_ADMIN":
      window.location.href = "/admin/companies.html";
      break;

    case "ADMIN_EMPRESA":
      window.location.href = "/uploads-history.html";
      break;

    default:
      await supabase.auth.signOut();
      throw new Error("Rol no autorizado.");
  }
}
