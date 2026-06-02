import { useEffect, useState } from 'react';
import type { Assinatura, Plano } from '../../services/assinaturaService';
import { assinaturaService, planoService } from '../../services/assinaturaService';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../services/usuarioService';
import { SearchBox } from '../../components/SearchBox';

export function Assinaturas() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [usuarios, setUsuarios]       = useState<Usuario[]>([]);
  const [planos, setPlanos]           = useState<Plano[]>([]);
  const [form, setForm] = useState<Omit<Assinatura, 'id'>>({ usuarioId: 0, planoId: 0, dataInicio: new Date().toISOString().split('T')[0], dataFim: '' });
  const [editId, setEditId]           = useState<number | null>(null);
  const [loading, setLoading]         = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([assinaturaService.getAll(), usuarioService.getAll(), planoService.getAll()])
      .then(([a, u, p]) => { setAssinaturas(a); setUsuarios(u); setPlanos(p); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const calcDataFim = (inicio: string, planoId: number) => {
    const plano = planos.find(p => p.id === planoId);
    if (!plano || !inicio) return '';
    const d = new Date(inicio);
    d.setMonth(d.getMonth() + plano.duracaoMeses);
    return d.toISOString().split('T')[0];
  };

  const handlePlanoChange = (planoId: number) => {
    setForm(f => ({ ...f, planoId, dataFim: calcDataFim(f.dataInicio, planoId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) { await assinaturaService.update(editId, form); }
    else { await assinaturaService.create(form); }
    setForm({ usuarioId: 0, planoId: 0, dataInicio: new Date().toISOString().split('T')[0], dataFim: '' });
    setEditId(null); load();
  };

  const handleEdit = (a: Assinatura) => {
    setForm({ usuarioId: a.usuarioId, planoId: a.planoId, dataInicio: a.dataInicio, dataFim: a.dataFim });
    setEditId(a.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta assinatura?')) return;
    await assinaturaService.remove(id); load();
  };

  const nomeUsuario = (id: number) => usuarios.find(u => u.id === id)?.nomeCompleto ?? `#${id}`;
  const nomePlano   = (id: number) => planos.find(p => p.id === id)?.nome ?? `#${id}`;

  return (
    <div className="page-container">
      <div className="page-header"><h2>Assinaturas</h2></div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Assinatura' : 'Nova Assinatura'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <SearchBox
                  label="Usuário"
                  placeholder="Buscar usuário..."
                  options={usuarios.map(u => ({ id: u.id!, label: u.nomeCompleto }))}
                  value={form.usuarioId}
                  onChange={id => setForm(f => ({ ...f, usuarioId: id }))}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Plano</label>
                <select className="form-select" value={form.planoId} onChange={e => handlePlanoChange(+e.target.value)} required>
                  <option value={0}>Selecione...</option>
                  {planos.map(p => <option key={p.id} value={p.id}>{p.nome} — R$ {p.preco.toFixed(2)} / {p.duracaoMeses}m</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Data de Início</label>
                <input type="date" className="form-control" value={form.dataInicio}
                  onChange={e => setForm(f => ({ ...f, dataInicio: e.target.value, dataFim: calcDataFim(e.target.value, f.planoId) }))} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Data de Fim</label>
                <input type="date" className="form-control" value={form.dataFim} readOnly />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Assinar'}</button>
              {editId && <button type="button" className="btn btn-secondary"
                onClick={() => { setForm({ usuarioId: 0, planoId: 0, dataInicio: new Date().toISOString().split('T')[0], dataFim: '' }); setEditId(null); }}>Cancelar</button>}
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
              <thead>
                <tr><th>#</th><th>Usuário</th><th>Plano</th><th>Início</th><th>Fim</th><th style={{ width: 100 }}>Ações</th></tr>
              </thead>
              <tbody>
                {assinaturas.map(a => (
                  <tr key={a.id}>
                    <td>{a.id}</td><td>{nomeUsuario(a.usuarioId)}</td><td>{nomePlano(a.planoId)}</td>
                    <td>{a.dataInicio}</td><td>{a.dataFim}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(a)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {assinaturas.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">Nenhuma assinatura registrada.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
