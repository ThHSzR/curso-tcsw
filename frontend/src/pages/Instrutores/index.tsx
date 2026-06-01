import { useEffect, useState } from 'react';
import { Instrutor } from '../../models/instrutor.model';

const BASE = 'http://localhost:3000/instrutores';

export function Instrutores() {
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [form, setForm] = useState<Instrutor>({ nome: '', email: '', bio: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(BASE).then(r => r.json()).then(d => { setInstrutores(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await fetch(`${BASE}/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setForm({ nome: '', email: '', bio: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (i: Instrutor) => { setForm({ nome: i.nome, email: i.email, bio: i.bio }); setEditId(i.id!); };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este instrutor?')) return;
    await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Instrutores</h2>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Instrutor' : 'Novo Instrutor'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Nome</label>
                <input className="form-control" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">E-mail</label>
                <input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Bio</label>
                <input className="form-control" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Adicionar'}</button>
              {editId && <button type="button" className="btn btn-secondary" onClick={() => { setForm({ nome: '', email: '', bio: '' }); setEditId(null); }}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead><tr><th>#</th><th>Nome</th><th>E-mail</th><th>Bio</th><th style={{ width: 120 }}>Ações</th></tr></thead>
              <tbody>
                {instrutores.map(i => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.nome}</td>
                    <td>{i.email}</td>
                    <td><span className="text-muted">{i.bio}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(i)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(i.id!)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {instrutores.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Nenhum instrutor cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
