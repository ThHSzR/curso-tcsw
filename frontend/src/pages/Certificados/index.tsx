import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { certificadoService } from '../../services/certificadoService';
import type { Certificado } from '../../services/certificadoService';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../services/usuarioService';
import { cursoService } from '../../services/cursoService';
import type { Curso } from '../../services/cursoService';

export function Certificados() {
  const [items, setItems]       = useState<Certificado[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos]     = useState<Curso[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'del'|'view'|null>(null);
  const [selected, setSelected] = useState<Certificado|null>(null);
  const [form, setForm]         = useState({ usuarioId:0, cursoId:0, dataEmissao: new Date().toISOString().slice(0,10), codigo:'', cargaHoraria:0 });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, u, cur] = await Promise.all([certificadoService.getAll(), usuarioService.getAll(), cursoService.getAll()]);
    setItems(c); setUsuarios(u); setCursos(cur); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const genCodigo = () => 'CERT-' + Math.random().toString(36).substring(2,10).toUpperCase();

  const openAdd  = () => {
    const curso = cursos[0];
    setForm({ usuarioId: usuarios[0]?.id??0, cursoId: curso?.id??0, dataEmissao: new Date().toISOString().slice(0,10), codigo: genCodigo(), cargaHoraria: curso?.cargaHoraria??0 });
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

  const filtered  = items.filter(i => getUser(i.usuarioId).toLowerCase().includes(search.toLowerCase()));
  const getUser   = (id:number) => usuarios.find(u=>u.id===id)?.nome ?? '-';
  const getCurso  = (id:number) => cursos.find(c=>c.id===id)?.nome ?? '-';
  const getCarga  = (id:number) => cursos.find(c=>c.id===id)?.cargaHoraria ?? 0;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Certificados</h1><p className="page-subtitle">{items.length} certificados emitidos</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Emitir Certificado</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de certificados</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar aluno..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Aluno</th><th>Curso</th><th>Código</th><th>Emissão</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            : filtered.length===0 ? <tr><td colSpan={6} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum certificado</p></td></tr>
            : filtered.map(c => (
              <tr key={c.id}>
                <td className="td-muted">{c.id}</td>
                <td style={{fontWeight:500}}>{getUser(c.usuarioId)}</td>
                <td className="td-muted">{getCurso(c.cursoId)}</td>
                <td><code style={{fontSize:12,background:'var(--surface-2)',padding:'2px 6px',borderRadius:4}}>{c.codigo}</code></td>
                <td className="td-muted">{c.dataEmissao}</td>
                <td><div className="table-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" title="Visualizar" onClick={()=>openView(c)}><i className="bi bi-eye"></i></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>openDel(c)}><i className="bi bi-trash3"></i></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal==='add' && (
        <Modal title="Emitir Certificado" onClose={()=>setModal(null)} onConfirm={save} confirmLabel="Emitir">
          <div className="field"><label>Aluno</label><select className="select" value={form.usuarioId} onChange={e=>setForm(f=>({...f,usuarioId:+e.target.value}))}>{usuarios.map(u=><option key={u.id} value={u.id}>{u.nome}</option>)}</select></div>
          <div className="field"><label>Curso</label><select className="select" value={form.cursoId} onChange={e=>{
            const id = +e.target.value;
            setForm(f=>({...f, cursoId:id, cargaHoraria: getCarga(id)}));
          }}>{cursos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="field"><label>Data de Emissão</label><input className="input" type="date" value={form.dataEmissao} onChange={e=>setForm(f=>({...f,dataEmissao:e.target.value}))} /></div>
            <div className="field"><label>Carga Horária (h)</label><input className="input" type="number" value={form.cargaHoraria} onChange={e=>setForm(f=>({...f,cargaHoraria:+e.target.value}))} /></div>
          </div>
          <div className="field"><label>Código</label><div style={{display:'flex',gap:8}}>
            <input className="input" value={form.codigo} onChange={e=>setForm(f=>({...f,codigo:e.target.value}))} />
            <button className="btn btn-ghost" type="button" onClick={()=>setForm(f=>({...f,codigo:genCodigo()}))}><i className="bi bi-arrow-clockwise"></i></button>
          </div></div>
        </Modal>
      )}

      {modal==='view' && selected && (
        <Modal title="Certificado" onClose={()=>setModal(null)}>
          <div style={{border:'2px solid var(--primary)',borderRadius:12,padding:32,textAlign:'center',background:'var(--surface-2)'}}>
            <i className="bi bi-patch-check-fill" style={{fontSize:48,color:'var(--primary)',display:'block',marginBottom:16}}></i>
            <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:2,color:'var(--text-muted)',marginBottom:8}}>Certificado de Conclusão</div>
            <h2 style={{fontSize:22,marginBottom:8}}>{getUser(selected.usuarioId)}</h2>
            <p style={{color:'var(--text-muted)',marginBottom:16}}>concluiu com êxito o curso</p>
            <h3 style={{fontSize:18,color:'var(--primary)',marginBottom:16}}>{getCurso(selected.cursoId)}</h3>
            <p style={{color:'var(--text-muted)',fontSize:13}}>Carga horária: <strong>{selected.cargaHoraria}h</strong></p>
            <p style={{color:'var(--text-muted)',fontSize:13}}>Emitido em: <strong>{selected.dataEmissao}</strong></p>
            <div style={{marginTop:20,padding:'8px 16px',background:'var(--surface)',borderRadius:8,display:'inline-block'}}>
              <code style={{fontSize:13}}>{selected.codigo}</code>
            </div>
          </div>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={()=>setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir certificado de <strong style={{color:'var(--text)'}}>{getUser(selected!.usuarioId)}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}</div>
    </div>
  );
}
