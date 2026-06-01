import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { usuarioService, Usuario } from '../../services/usuarioService';

export function Usuarios() {
  const [items, setItems]       = useState<Usuario[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected] = useState<Usuario|null>(null);
  const [form, setForm]         = useState({ nome:'', email:'', senha:'', tipo:'aluno' as Usuario['tipo'] });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await usuarioService.getAll()); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ nome:'', email:'', senha:'', tipo:'aluno' }); setModal('add'); };
  const openEdit = (u: Usuario) => { setSelected(u); setForm({ nome:u.nome, email:u.email, senha:u.senha, tipo:u.tipo }); setModal('edit'); };
  const openDel  = (u: Usuario) => { setSelected(u); setModal('del'); };

  const save = async () => {
    try {
      if (modal==='add') await usuarioService.create(form);
      else if (modal==='edit'&&selected) await usuarioService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal==='add'?'Usuário criado!':'Usuário atualizado!', type:'success' });
    } catch { setToast({ msg:'Erro ao salvar', type:'error' }); }
  };

  const del = async () => {
    try { await usuarioService.remove(selected!.id!); await load(); setModal(null); setToast({ msg:'Usuário removido', type:'success' }); }
    catch { setToast({ msg:'Erro ao remover', type:'error' }); }
  };

  const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase()));
  const tipoBadge = (t:string) => t==='admin'?'badge-danger':t==='instrutor'?'badge-warning':'badge-primary';
  const initials  = (nome:string) => nome.split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase();

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Usuários</h1><p className="page-subtitle">{items.length} usuários cadastrados</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Novo Usuário</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de usuários</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Nome</th><th>E-mail</th><th>Tipo</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            : filtered.length===0 ? <tr><td colSpan={5} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum usuário</p></td></tr>
            : filtered.map(u => (
              <tr key={u.id}>
                <td className="td-muted">{u.id}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:'var(--primary-light)',color:'var(--primary-hover)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{initials(u.nome)}</div>
                    <span style={{fontWeight:500}}>{u.nome}</span>
                  </div>
                </td>
                <td className="td-muted">{u.email}</td>
                <td><span className={`badge ${tipoBadge(u.tipo)}`}>{u.tipo}</span></td>
                <td><div className="table-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>openEdit(u)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>openDel(u)}><i className="bi bi-trash3"></i></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'Novo Usuário':'Editar Usuário'} onClose={()=>setModal(null)} onConfirm={save}>
          <div className="field"><label>Nome</label><input className="input" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} /></div>
          <div className="field"><label>E-mail</label><input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="field"><label>Senha</label><input className="input" type="password" value={form.senha} onChange={e=>setForm(f=>({...f,senha:e.target.value}))} /></div>
            <div className="field"><label>Tipo</label><select className="select" value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value as Usuario['tipo']}))}
              ><option value="aluno">Aluno</option><option value="instrutor">Instrutor</option><option value="admin">Admin</option></select></div>
          </div>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={()=>setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir o usuário <strong style={{color:'var(--text)'}}>{selected?.nome}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}</div>
    </div>
  );
}
