import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { cursoService, Curso } from '../../services/cursoService';
import { categoriaService, Categoria } from '../../services/categoriaService';
import { nivelService, Nivel } from '../../services/nivelService';
import { instrutorService, Instrutor } from '../../services/instrutorService';

export function Cursos() {
  const [items, setItems]       = useState<Curso[]>([]);
  const [cats, setCats]         = useState<Categoria[]>([]);
  const [niveis, setNiveis]     = useState<Nivel[]>([]);
  const [instrs, setInstrs]     = useState<Instrutor[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected] = useState<Curso|null>(null);
  const [form, setForm]         = useState({ nome:'', descricao:'', cargaHoraria:0, instrutorId:0, categoriaId:0, nivelId:0 });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, cat, n, i] = await Promise.all([cursoService.getAll(), categoriaService.getAll(), nivelService.getAll(), instrutorService.getAll()]);
    setItems(c); setCats(cat); setNiveis(n); setInstrs(i); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ nome:'', descricao:'', cargaHoraria:0, instrutorId: instrs[0]?.id??0, categoriaId: cats[0]?.id??0, nivelId: niveis[0]?.id??0 }); setModal('add'); };
  const openEdit = (c: Curso) => { setSelected(c); setForm({ nome:c.nome, descricao:c.descricao, cargaHoraria:c.cargaHoraria, instrutorId:c.instrutorId, categoriaId:c.categoriaId, nivelId:c.nivelId }); setModal('edit'); };
  const openDel  = (c: Curso) => { setSelected(c); setModal('del'); };

  const save = async () => {
    try {
      if (modal==='add') await cursoService.create(form);
      else if (modal==='edit' && selected) await cursoService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal==='add' ? 'Curso criado!' : 'Curso atualizado!', type:'success' });
    } catch { setToast({ msg:'Erro ao salvar', type:'error' }); }
  };

  const del = async () => {
    try { await cursoService.remove(selected!.id!); await load(); setModal(null); setToast({ msg:'Curso removido', type:'success' }); }
    catch { setToast({ msg:'Erro ao remover', type:'error' }); }
  };

  const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()));
  const getNivel = (id:number) => niveis.find(n=>n.id===id)?.nome ?? '-';
  const getCat   = (id:number) => cats.find(c=>c.id===id)?.nome ?? '-';
  const getInstr = (id:number) => instrs.find(i=>i.id===id)?.nome ?? '-';

  const nivelBadge = (nome:string) => nome.includes('Inicia') ? 'badge-success' : nome.includes('Avan') ? 'badge-danger' : 'badge-warning';

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Cursos</h1><p className="page-subtitle">{items.length} cursos cadastrados</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Novo Curso</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de cursos</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Nome</th><th>Instrutor</th><th>Categoria</th><th>Nível</th><th>Carga</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            : filtered.length === 0 ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum curso encontrado</p></td></tr>
            : filtered.map(c => (
              <tr key={c.id}>
                <td className="td-muted">{c.id}</td>
                <td style={{fontWeight:500}}>{c.nome}</td>
                <td className="td-muted">{getInstr(c.instrutorId)}</td>
                <td><span className="badge badge-muted">{getCat(c.categoriaId)}</span></td>
                <td><span className={`badge ${nivelBadge(getNivel(c.nivelId))}`}>{getNivel(c.nivelId)}</span></td>
                <td className="td-muted">{c.cargaHoraria}h</td>
                <td><div className="table-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>openEdit(c)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>openDel(c)}><i className="bi bi-trash3"></i></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'Novo Curso':'Editar Curso'} onClose={()=>setModal(null)} onConfirm={save}>
          <div className="field"><label>Nome</label><input className="input" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} /></div>
          <div className="field"><label>Descrição</label><textarea className="textarea" value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="field"><label>Carga horária (h)</label><input className="input" type="number" value={form.cargaHoraria} onChange={e=>setForm(f=>({...f,cargaHoraria:+e.target.value}))} /></div>
            <div className="field"><label>Nível</label><select className="select" value={form.nivelId} onChange={e=>setForm(f=>({...f,nivelId:+e.target.value}))}>{niveis.map(n=><option key={n.id} value={n.id}>{n.nome}</option>)}</select></div>
            <div className="field"><label>Categoria</label><select className="select" value={form.categoriaId} onChange={e=>setForm(f=>({...f,categoriaId:+e.target.value}))}>{cats.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            <div className="field"><label>Instrutor</label><select className="select" value={form.instrutorId} onChange={e=>setForm(f=>({...f,instrutorId:+e.target.value}))}>{instrs.map(i=><option key={i.id} value={i.id}>{i.nome}</option>)}</select></div>
          </div>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={()=>setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir o curso <strong style={{color:'var(--text)'}}>{selected?.nome}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}</div>
    </div>
  );
}
