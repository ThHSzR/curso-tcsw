import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { certificadoService, Certificado, matriculaService, Matricula } from '../../services/certificadoService';
import { usuarioService, Usuario } from '../../services/usuarioService';
import { cursoService, Curso } from '../../services/cursoService';

export function Certificados() {
  const [items, setItems]       = useState<Certificado[]>([]);
  const [users, setUsers]       = useState<Usuario[]>([]);
  const [cursos, setCursos]     = useState<Curso[]>([]);
  const [mats, setMats]         = useState<Matricula[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'del'|'view'|null>(null);
  const [selected, setSelected] = useState<Certificado|null>(null);
  const [form, setForm]         = useState({ usuarioId:0, cursoId:0, matriculaId:0, dataEmissao:'', codigo:'' });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, u, cu, m] = await Promise.all([certificadoService.getAll(), usuarioService.getAll(), cursoService.getAll(), matriculaService.getAll()]);
    setItems(c); setUsers(u); setCursos(cu); setMats(m); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const genCode = () => `CERT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

  const openAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setForm({ usuarioId: users[0]?.id??0, cursoId: cursos[0]?.id??0, matriculaId: mats[0]?.id??0, dataEmissao: today, codigo: genCode() });
    setModal('add');
  };
  const openDel  = (c: Certificado) => { setSelected(c); setModal('del'); };
  const openView = (c: Certificado) => { setSelected(c); setModal('view'); };

  const save = async () => {
    try { await certificadoService.create(form); await load(); setModal(null); setToast({ msg:'Certificado emitido!', type:'success' }); }
    catch { setToast({ msg:'Erro ao emitir', type:'error' }); }
  };

  const del = async () => {
    try { await certificadoService.remove(selected!.id!); await load(); setModal(null); setToast({ msg:'Certificado removido', type:'success' }); }
    catch { setToast({ msg:'Erro ao remover', type:'error' }); }
  };

  const filtered = items.filter(i => {
    const u = users.find(u=>u.id===i.usuarioId)?.nome ?? '';
    const c = cursos.find(c=>c.id===i.cursoId)?.nome ?? '';
    return u.toLowerCase().includes(search.toLowerCase()) || c.toLowerCase().includes(search.toLowerCase()) || i.codigo.toLowerCase().includes(search.toLowerCase());
  });

  const getUser  = (id:number) => users.find(u=>u.id===id)?.nome ?? '-';
  const getCurso = (id:number) => cursos.find(c=>c.id===id)?.nome ?? '-';

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Certificados</h1><p className="page-subtitle">{items.length} certificados emitidos</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-patch-check"></i> Emitir Certificado</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de certificados</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Código</th><th>Usuário</th><th>Curso</th><th>Emissão</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            : filtered.length===0 ? <tr><td colSpan={6} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum certificado</p></td></tr>
            : filtered.map(c => (
              <tr key={c.id}>
                <td className="td-muted">{c.id}</td>
                <td><span style={{fontFamily:'monospace',fontSize:12,background:'var(--surface-2)',padding:'2px 8px',borderRadius:'var(--radius-sm)',color:'var(--primary-hover)'}}>{c.codigo}</span></td>
                <td style={{fontWeight:500}}>{getUser(c.usuarioId)}</td>
                <td className="td-muted">{getCurso(c.cursoId)}</td>
                <td className="td-muted">{c.dataEmissao}</td>
                <td><div className="table-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" title="Visualizar" onClick={()=>openView(c)}><i className="bi bi-eye"></i></button>
                  <button className="btn btn-danger btn-icon btn-sm" title="Excluir" onClick={()=>openDel(c)}><i className="bi bi-trash3"></i></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal==='add' && (
        <Modal title="Emitir Certificado" onClose={()=>setModal(null)} onConfirm={save} confirmLabel="Emitir">
          <div className="field"><label>Usuário</label><select className="select" value={form.usuarioId} onChange={e=>setForm(f=>({...f,usuarioId:+e.target.value}))}>{users.map(u=><option key={u.id} value={u.id}>{u.nome}</option>)}</select></div>
          <div className="field"><label>Curso</label><select className="select" value={form.cursoId} onChange={e=>setForm(f=>({...f,cursoId:+e.target.value}))}>{cursos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
          <div className="field"><label>Matrícula</label><select className="select" value={form.matriculaId} onChange={e=>setForm(f=>({...f,matriculaId:+e.target.value}))}>{mats.map(m=><option key={m.id} value={m.id}>#{m.id} — Usuário {m.usuarioId}</option>)}</select></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="field"><label>Data de emissão</label><input className="input" type="date" value={form.dataEmissao} onChange={e=>setForm(f=>({...f,dataEmissao:e.target.value}))} /></div>
            <div className="field"><label>Código</label><input className="input" value={form.codigo} onChange={e=>setForm(f=>({...f,codigo:e.target.value}))} /></div>
          </div>
        </Modal>
      )}

      {modal==='view' && selected && (
        <Modal title="Certificado" onClose={()=>setModal(null)}>
          <div style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:24,textAlign:'center'}}>
            <i className="bi bi-patch-check-fill" style={{fontSize:48,color:'var(--primary)',display:'block',marginBottom:12}}></i>
            <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>{getUser(selected.usuarioId)}</div>
            <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:16}}>concluiu com êxito o curso</div>
            <div style={{fontSize:16,fontWeight:600,color:'var(--primary-hover)',marginBottom:16}}>{getCurso(selected.cursoId)}</div>
            <div style={{fontFamily:'monospace',fontSize:13,background:'var(--surface-3)',padding:'6px 14px',borderRadius:'var(--radius-sm)',display:'inline-block',color:'var(--text-muted)'}}>{selected.codigo}</div>
            <div style={{fontSize:11,color:'var(--text-faint)',marginTop:12}}>Emitido em {selected.dataEmissao}</div>
          </div>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={()=>setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir o certificado <strong style={{color:'var(--text)'}}>{selected?.codigo}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}</div>
    </div>
  );
}
