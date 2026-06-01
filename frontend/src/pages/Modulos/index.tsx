import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { moduloService, Modulo } from '../../services/moduloService';
import { cursoService, Curso } from '../../services/cursoService';

export function Modulos() {
  const [items, setItems]       = useState<Modulo[]>([]);
  const [cursos, setCursos]     = useState<Curso[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected] = useState<Modulo|null>(null);
  const [form, setForm]         = useState({ nome:'', ordem:1, cursoId:0 });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [m, c] = await Promise.all([moduloService.getAll(), cursoService.getAll()]);
    setItems(m); setCursos(c); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ nome:'', ordem:1, cursoId: cursos[0]?.id??0 }); setModal('add'); };
  const openEdit = (m: Modulo) => { setSelected(m); setForm({ nome:m.nome, ordem:m.ordem, cursoId:m.cursoId }); setModal('edit'); };
  const openDel  = (m: Modulo) => { setSelected(m); setModal('del'); };

  const save = async () => {
    try {
      if (modal==='add') await moduloService.create(form);
      else if (modal==='edit' && selected) await moduloService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal==='add'?'Módulo criado!':'Módulo atualizado!', type:'success' });
    } catch { setToast({ msg:'Erro ao salvar', type:'error' }); }
  };

  const del = async () => {
    try { await moduloService.remove(selected!.id!); await load(); setModal(null); setToast({ msg:'Módulo removido', type:'success' }); }
    catch { setToast({ msg:'Erro ao remover', type:'error' }); }
  };

  const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()));
  const getCurso = (id:number) => cursos.find(c=>c.id===id)?.nome ?? '-';

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Módulos</h1><p className="page-subtitle">{items.length} módulos cadastrados</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Novo Módulo</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de módulos</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Nome</th><th>Curso</th><th>Ordem</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            : filtered.length===0 ? <tr><td colSpan={5} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum módulo</p></td></tr>
            : filtered.map(m => (
              <tr key={m.id}>
                <td className="td-muted">{m.id}</td>
                <td style={{fontWeight:500}}>{m.nome}</td>
                <td><span className="badge badge-info">{getCurso(m.cursoId)}</span></td>
                <td><span className="badge badge-muted">#{m.ordem}</span></td>
                <td><div className="table-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>openEdit(m)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>openDel(m)}><i className="bi bi-trash3"></i></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'Novo Módulo':'Editar Módulo'} onClose={()=>setModal(null)} onConfirm={save}>
          <div className="field"><label>Nome</label><input className="input" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="field"><label>Curso</label><select className="select" value={form.cursoId} onChange={e=>setForm(f=>({...f,cursoId:+e.target.value}))}>{cursos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            <div className="field"><label>Ordem</label><input className="input" type="number" min={1} value={form.ordem} onChange={e=>setForm(f=>({...f,ordem:+e.target.value}))} /></div>
          </div>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={()=>setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir o módulo <strong style={{color:'var(--text)'}}>{selected?.nome}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}</div>
    </div>
  );
}
