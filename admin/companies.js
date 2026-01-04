import { supabase } from "../js/supabaseClient.js";

async function guardSuperAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .select('role_id, roles(code)')
    .eq('id', user.id)
    .single();

  if (error || data.roles.code !== 'SUPER_ADMIN') {
    alert('Acceso denegado');
    window.location.href = '/';
  }
}

guardSuperAdmin();

const form = document.getElementById('createCompanyForm');
const result = document.getElementById('result');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const companyName = document.getElementById("companyName").value;
  const adminEmail = document.getElementById("adminEmail").value;

  result.textContent = "Enviando invitación...";

  const { data, error } = await supabase.functions.invoke(
    "invite-company-admin",
    {
      body: {
        companyName,
        adminEmail,
      },
    }
  );

  if (error) {
    result.textContent = `Error: ${error.message}`;
    return;
  }

  result.textContent = "Empresa creada e invitación enviada ✔️";
});
