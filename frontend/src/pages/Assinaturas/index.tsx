import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { assinaturaService, planoService } from '../../services/assinaturaService';
import type { Assinatura, Plano } from '../../services/assinaturaService';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../services/usuarioService';

export function Assinaturas() {
  const [items, setItems]       = useState<Assinatura[]>([]);
  const [planos, setPlanos]     = useState<Plano[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'edit'|'del'|'planos'|null>(null);
  const [selected, setSelected] = useState<Assinatura|null>(null);
  const [form, setForm]         = useState({ usuarioId:0, planoId:0, dataInicio:'', dataFim:'', status:'ativa' as Assinatura['status'] });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);
  const [formPlano, setFormPlano] = useState({ nome:'', preco:0, descricao:'' });

  const load = useCallback(async () => {
    setLoading(true);
    const [a, p, u] = await Promise.all([assinaturaService.getAll(), planoService.getAll(), usuarioService.getAll()]);
    setItems(a); setPlanos(p); setUsuarios(u); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ usuarioId: usuarios[0]?.id??0, planoId: planos[0]?.id??0, dataInicio:'', dataFim:'', status:'ativa' }); setModal('add'); };
  const openEdit = (a: Assinatura) => { setSelected(a); setForm({ usuarioId:a.usuarioId, planoId:a.planoId, dataInicio:a.dataInicio, dataFim:a.dataFim, status:a.status }); setModal('edit'); };
  const openDel  = (a: Assinatura) => { setSelected(a); setModal('del'); };

  const save = async () => {
    try {
      if (modal==='add') await assinaturaService.create(form);
      else if (modal==='edit'&&selected) await assinaturaService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal==='add'?'Assinatura criada!':'Assinatura atualizada!', type:'success' });
    } catch { setToast({ msg:'Erro ao salvar', type:'error' }); }
  };

  const del = async () => {
    try { await assinaturaService.remove(selected!.id!); await load(); setModal(null); setToast({ msg:'Assinatura removida', type:'success' }); }
    catch { setToast({ msg:'Erro ao remover', type:'error' }); }
  };

  const savePlano = async () => {
    try { await planoService.create(formPlano); await load(); setFormPlano({ nome:'', preco:0, descricao:'' }); setToast({ msg:'Plano criado!', type:'success' }); }
    catch { setToast({ msg:'Erro ao criar plano', type:'error' }); }
  };

  const getUser     = (id:number) => usuarios.find(u=>u.id===id)?.nome ?? '-';
  const getPlano    = (id:number) => planos.find(p=>p.id===id)?.nome ?? '-';
  const statusBadge = (s:string) => s==='ativa'?'badge-success':s==='cancelada'?'badge-danger':'badge-muted';

  const filtered = items.filter(i => getUser(i.usuarioId).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Assinaturas</h1><p className="page-subtitle">{items.length} assinaturas cadastradas</p></div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost" onClick={()=>setModal('planos')}><i className="bi bi-list-ul"></i> Planos</button>
          <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Nova Assinatura</button>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de assinaturas</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar usuário..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Usuário</th><th>Plano</th><th>Início</th><th>Fim</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            : filtered.length===0 ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhuma assinatura</p></td></tr>
            : filtered.map(a => (
              <tr key={a.id}>
                <td className="td-muted">{a.id}</td>
                <td style={{fontWeight:500}}>{getUser(a.usuarioId)}</td>
                <td className="td-muted">{getPlano(a.planoId)}</td>
                <td className="td-muted">{a.dataInicio}</td>
                <td className="td-muted">{a.dataFim}</td>
                <td><span className={`badge ${statusBadge(a.status)}`}>{a.status}</span></td>
                <td><div className="table-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>openEdit(a)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>openDel(a)}><i className="bi bi-trash3"></i></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'Nova Assinatura':'Editar Assinatura'} onClose={()=>setModal(null)} onConfirm={save}>
          <div className="field"><label>Usuário</label><select className="select" value={form.usuarioId} onChange={e=>setForm(f=>({...f,usuarioId:+e.target.value}))}>{usuarios.map(u=><option key={u.id} value={u.id}>{u.nome}</option>)}</select></div>
          <div className="field"><label>Plano</label><select className="select" value={form.planoId} onChange={e=>setForm(f=>({...f,planoId:+e.target.value}))}>{planos.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="field"><label>Data Início</label><input className="input" type="date" value={form.dataInicio} onChange={e=>setForm(f=>({...f,dataInicio:e.target.value}))} /></div>
            <div className="field"><label>Data Fim</label><input className="input" type="date" value={form.dataFim} onChange={e=>setForm(f=>({...f,dataFim:e.target.value}))} /></div>
          </div>
          <div className="field"><label>Status</label><select className="select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value as Assinatura['status']}))}>            <option value="ativa">Ativa</option><option value="cancelada">Cancelada</option><option value="expirada">Expirada</option>
          </select></div>
        </Modal>
      )}

      {modal==='planos' && (
        <Modal title="Gerenciar Planos" onClose={()=>setModal(null)}>
          <div style={{marginBottom:16}}>
            <div className="field"><label>Nome do Plano</label><input className="input" value={formPlano.nome} onChange={e=>setFormPlano(f=>({...f,nome:e.target.value}))} /></div>
            <div className="field"><label>Preço (R$)</label><input className="input" type="number" step="0.01" value={formPlano.preco} onChange={e=>setFormPlano(f=>({...f,preco:+e.target.value}))} /></div>
            <div className="field"><label>Descrição</label><textarea className="textarea" value={formPlano.descricao} onChange={e=>setFormPlano(f=>({...f,descricao:e.target.value}))} /></div>
            <button className="btn btn-primary" onClick={savePlano}>Criar Plano</button>
          </div>
          <table>
            <thead><tr><th>#</th><th>Nome</th><th>Preço</th><th>Ações</th></tr></thead>
            <tbody>{planos.map(p=>(
              <tr key={p.id}><td className="td-muted">{p.id}</td><td>{p.nome}</td><td>R$ {p.preco?.toFixed(2)}</td>
                <td><button className="btn btn-danger btn-icon btn-sm" onClick={async()=>{await planoService.remove(p.id!);await load();}}><i className="bi bi-trash3"></i></button></td>
              </tr>
            ))}</tbody>
          </table>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={()=>setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir assinatura de <strong style={{color:'var(--text)'}}>{getUser(selected!.usuarioId)}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}</div>
    </div>
  );
}
