import { useEffect, useState } from 'react';
import type { Nivel } from '../../models/nivel.model';

const BASE = 'http://localhost:3001/niveis';

export function Niveis() {
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [form, setForm] = useState<Omit<Nivel, 'id'>>({ nome: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(BASE).then(r => r.json()).then(d => { setNiveis(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await fetch(`${BASE}/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setForm({ nome: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (n: Nivel) => { setForm({ nome: n.nome }); setEditId(n.id); };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este nível?')) return;
    await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Níveis</h2>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Nível' : 'Novo Nível'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input className="form-control" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Adicionar'}</button>
              {editId && <button type="button" className="btn btn-secondary" onClick={() => { setForm({ nome: '' }); setEditId(null); }}>Cancelar</button>}
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
              <thead><tr><th>#</th><th>Nome</th><th style={{ width: 120 }}>Ações</th></tr></thead>
              <tbody>
                {niveis.map(n => (
                  <tr key={n.id}>
                    <td>{n.id}</td>
                    <td>{n.nome}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(n)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(n.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {niveis.length === 0 && <tr><td colSpan={3} className="text-center text-muted py-4">Nenhum nível cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
