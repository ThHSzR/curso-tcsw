import { useState, useEffect, useCallback } from 'react';
import { Modal }  from '../../components/Modal';
import { Toast }  from '../../components/Toast';
import { matriculaService } from '../../services/matriculaService';
import type { Matricula }   from '../../services/matriculaService';
import { usuarioService }   from '../../services/usuarioService';
import type { Usuario }     from '../../services/usuarioService';
import { cursoService }     from '../../services/cursoService';
import type { Curso }       from '../../services/cursoService';

export function Matriculas() {
  const [items, setItems]       = useState<Matricula[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos]     = useState<Curso[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected] = useState<Matricula|null>(null);
  const [form, setForm]         = useState({ usuarioId: 0, cursoId: 0, dataMatricula: '', progresso: 0 });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [m, u, c] = await Promise.all([matriculaService.getAll(), usuarioService.getAll(), cursoService.getAll()]);
    setItems(m); setUsuarios(u); setCursos(c); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getUser  = (id: number) => usuarios.find(u => u.id === id)?.nome ?? '-';
  const getCurso = (id: number) => cursos.find(c => c.id === id)?.nome ?? '-';

  const openAdd  = () => { setForm({ usuarioId: usuarios[0]?.id ?? 0, cursoId: cursos[0]?.id ?? 0, dataMatricula: new Date().toISOString().slice(0,10), progresso: 0 }); setModal('add'); };
  const openEdit = (m: Matricula) => { setSelected(m); setForm({ usuarioId: m.usuarioId, cursoId: m.cursoId, dataMatricula: m.dataMatricula, progresso: m.progresso }); setModal('edit'); };
  const openDel  = (m: Matricula) => { setSelected(m); setModal('del'); };

  const save = async () => {
    try {
      if (modal === 'add') await matriculaService.create(form);
      else if (modal === 'edit' && selected) await matriculaService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal === 'add' ? 'Matrícula criada!' : 'Matrícula atualizada!', type: 'success' });
    } catch { setToast({ msg: 'Erro ao salvar', type: 'error' }); }
  };

  const del = async () => {
    try { await matriculaService.remove(selected!.id!); await load(); setModal(null); setToast({ msg: 'Matrícula removida', type: 'success' }); }
    catch { setToast({ msg: 'Erro ao remover', type: 'error' }); }
  };

  const filtered = items.filter(i =>
    getUser(i.usuarioId).toLowerCase().includes(search.toLowerCase()) ||
    getCurso(i.cursoId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Matrículas</h1><p className="page-subtitle">{items.length} matrículas cadastradas</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Nova Matrícula</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de matrículas</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar usuário ou curso..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Usuário</th><th>Curso</th><th>Data Matrícula</th><th>Progresso</th><th>Ações</th></tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={6} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
              : filtered.length === 0
              ? <tr><td colSpan={6} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhuma matrícula</p></td></tr>
              : filtered.map(m => (
                <tr key={m.id}>
                  <td className="td-muted">{m.id}</td>
                  <td style={{ fontWeight: 500 }}>{getUser(m.usuarioId)}</td>
                  <td className="td-muted">{getCurso(m.cursoId)}</td>
                  <td className="td-muted">{m.dataMatricula}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--surface-3)', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${m.progresso}%`, background: 'var(--primary)', borderRadius: 99 }} />
                      </div>
                      <span className="td-muted" style={{ fontSize: 12, minWidth: 32 }}>{m.progresso}%</span>
                    </div>
                  </td>
                  <td><div className="table-actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(m)}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => openDel(m)}><i className="bi bi-trash3"></i></button>
                  </div></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Nova Matrícula' : 'Editar Matrícula'} onClose={() => setModal(null)} onConfirm={save}>
          <div className="field"><label>Usuário</label>
            <select className="select" value={form.usuarioId} onChange={e => setForm(f => ({ ...f, usuarioId: +e.target.value }))}>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </div>
          <div className="field"><label>Curso</label>
            <select className="select" value={form.cursoId} onChange={e => setForm(f => ({ ...f, cursoId: +e.target.value }))}>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="field"><label>Data Matrícula</label>
            <input className="input" type="date" value={form.dataMatricula} onChange={e => setForm(f => ({ ...f, dataMatricula: e.target.value }))} />
          </div>
          <div className="field"><label>Progresso ({form.progresso}%)</label>
            <input type="range" min={0} max={100} value={form.progresso} onChange={e => setForm(f => ({ ...f, progresso: +e.target.value }))} style={{ width: '100%' }} />
          </div>
        </Modal>
      )}

      {modal === 'del' && (
        <Modal title="Confirmar exclusão" onClose={() => setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{ color: 'var(--text-muted)' }}>Excluir matrícula de <strong style={{ color: 'var(--text)' }}>{getUser(selected!.usuarioId)}</strong> em <strong style={{ color: 'var(--text)' }}>{getCurso(selected!.cursoId)}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</div>
    </div>
  );
}
