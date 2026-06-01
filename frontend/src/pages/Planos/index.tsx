import { useEffect, useState } from 'react';
import { planoService } from '../../services/assinaturaService';
import type { Plano } from '../../services/assinaturaService';

export function Planos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [form, setForm] = useState<Plano>({ nome: '', preco: 0, descricao: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    planoService.getAll().then(d => { setPlanos(d); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await planoService.update(editId, form);
    } else {
      await planoService.create(form);
    }
    setForm({ nome: '', preco: 0, descricao: '' });
    setEditId(null);
    load();
  };

  const handleEdit = (p: Plano) => { setForm({ nome: p.nome, preco: p.preco, descricao: p.descricao }); setEditId(p.id!); };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este plano?')) return;
    await planoService.remove(id);
    load();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Planos</h2>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Plano' : 'Novo Plano'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Nome</label>
                <input className="form-control" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Preço (R$)</label>
                <input type="number" step="0.01" min="0" className="form-control" value={form.preco} onChange={e => setForm({ ...form, preco: parseFloat(e.target.value) })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Descrição</label>
                <input className="form-control" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Adicionar'}</button>
              {editId && <button type="button" className="btn btn-secondary" onClick={() => { setForm({ nome: '', preco: 0, descricao: '' }); setEditId(null); }}>Cancelar</button>}
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
              <thead><tr><th>#</th><th>Nome</th><th>Preço</th><th>Descrição</th><th style={{ width: 120 }}>Ações</th></tr></thead>
              <tbody>
                {planos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><strong>{p.nome}</strong></td>
                    <td>R$ {p.preco.toFixed(2)}</td>
                    <td><span className="text-muted">{p.descricao}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id!)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {planos.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Nenhum plano cadastrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
