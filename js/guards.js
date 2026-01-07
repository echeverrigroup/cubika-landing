import { supabase } from "./supabaseClient.js";

export async function guardAuthenticated() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/login.html";
    throw new Error("No autenticado");
  }

  return user;
}

export async function guardRole(allowedRoles = []) {
  const user = await guardAuthenticated();

  const { data, error } = await supabase
    .from("users")
    .select("roles(code)")
    .eq("id", user.id)
    .single();

  if (error || !allowedRoles.includes(data.roles.code)) {
    alert("Acceso denegado");
    window.location.href = "/";
    throw new Error("Rol no autorizado");
  }

  return data.roles.code;
}
