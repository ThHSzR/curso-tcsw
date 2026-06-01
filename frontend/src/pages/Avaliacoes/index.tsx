import { useState, useEffect, useCallback } from 'react';
import { Modal }  from '../../components/Modal';
import { Toast }  from '../../components/Toast';
import { avaliacaoService } from '../../services/avaliacaoService';
import type { Avaliacao }   from '../../services/avaliacaoService';
import { usuarioService }   from '../../services/usuarioService';
import type { Usuario }     from '../../services/usuarioService';
import { cursoService }     from '../../services/cursoService';
import type { Curso }       from '../../services/cursoService';

export function Avaliacoes() {
  const [items, setItems]       = useState<Avaliacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos]     = useState<Curso[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'del'|null>(null);
  const [selected, setSelected] = useState<Avaliacao|null>(null);
  const [form, setForm]         = useState({ usuarioId: 0, cursoId: 0, nota: 5, comentario: '', dataAvaliacao: '' });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [a, u, c] = await Promise.all([avaliacaoService.getAll(), usuarioService.getAll(), cursoService.getAll()]);
    setItems(a); setUsuarios(u); setCursos(c); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getUser  = (id: number) => usuarios.find(u => u.id === id)?.nome ?? '-';
  const getCurso = (id: number) => cursos.find(c => c.id === id)?.nome ?? '-';
  const stars    = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  const openAdd = () => { setForm({ usuarioId: usuarios[0]?.id ?? 0, cursoId: cursos[0]?.id ?? 0, nota: 5, comentario: '', dataAvaliacao: new Date().toISOString().slice(0,10) }); setModal('add'); };
  const openDel = (a: Avaliacao) => { setSelected(a); setModal('del'); };

  const save = async () => {
    try { await avaliacaoService.create(form); await load(); setModal(null); setToast({ msg: 'Avaliação registrada!', type: 'success' }); }
    catch { setToast({ msg: 'Erro ao salvar', type: 'error' }); }
  };

  const del = async () => {
    try { await avaliacaoService.remove(selected!.id!); await load(); setModal(null); setToast({ msg: 'Avaliação removida', type: 'success' }); }
    catch { setToast({ msg: 'Erro ao remover', type: 'error' }); }
  };

  const filtered = items.filter(i =>
    getUser(i.usuarioId).toLowerCase().includes(search.toLowerCase()) ||
    getCurso(i.cursoId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Avaliações</h1><p className="page-subtitle">{items.length} avaliações registradas</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Nova Avaliação</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de avaliações</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar usuário ou curso..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Usuário</th><th>Curso</th><th>Nota</th><th>Comentário</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
              : filtered.length === 0
              ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhuma avaliação</p></td></tr>
              : filtered.map(a => (
                <tr key={a.id}>
                  <td className="td-muted">{a.id}</td>
                  <td style={{ fontWeight: 500 }}>{getUser(a.usuarioId)}</td>
                  <td className="td-muted">{getCurso(a.cursoId)}</td>
                  <td style={{ color: 'var(--warning)', letterSpacing: 1 }}>{stars(a.nota)}</td>
                  <td className="td-muted">{a.comentario || '—'}</td>
                  <td className="td-muted">{a.dataAvaliacao}</td>
                  <td><button className="btn btn-danger btn-icon btn-sm" onClick={() => openDel(a)}><i className="bi bi-trash3"></i></button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {modal === 'add' && (
        <Modal title="Nova Avaliação" onClose={() => setModal(null)} onConfirm={save}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label>Nota ({form.nota}/5)</label>
              <input type="range" min={1} max={5} value={form.nota} onChange={e => setForm(f => ({ ...f, nota: +e.target.value }))} style={{ width: '100%' }} />
              <div style={{ color: 'var(--warning)', fontSize: 18, marginTop: 4 }}>{stars(form.nota)}</div>
            </div>
            <div className="field"><label>Data</label><input className="input" type="date" value={form.dataAvaliacao} onChange={e => setForm(f => ({ ...f, dataAvaliacao: e.target.value }))} /></div>
          </div>
          <div className="field"><label>Comentário</label><textarea className="textarea" value={form.comentario} onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))} /></div>
        </Modal>
      )}

      {modal === 'del' && (
        <Modal title="Confirmar exclusão" onClose={() => setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{ color: 'var(--text-muted)' }}>Excluir avaliação de <strong style={{ color: 'var(--text)' }}>{getUser(selected!.usuarioId)}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</div>
    </div>
  );
}
