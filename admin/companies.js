import { supabase } from '../supabaseClient.js';

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

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const companyName = document.getElementById('companyName').value;
  const adminUid = document.getElementById('adminUid').value;

  result.textContent = 'Creando empresa...';

  const { data, error } = await supabase.rpc(
    'create_company_with_admin',
    {
      p_company_name: companyName,
      p_admin_user_id: adminUid
    }
  );

  if (error) {
    result.textContent = `Error: ${error.message}`;
    return;
  }

  result.textContent = `Empresa creada:\n${JSON.stringify(data, null, 2)}`;
});
