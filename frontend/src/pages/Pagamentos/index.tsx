import { useEffect, useState } from 'react';
import type { Pagamento } from '../../services/pagamentoService';
import { pagamentoService } from '../../services/pagamentoService';
import { assinaturaService } from '../../services/assinaturaService';
import type { Assinatura } from '../../services/assinaturaService';

const METODOS = ['Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'PIX'];

function gerarTransacao() {
  return 'TXN-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [form, setForm] = useState<Omit<Pagamento, 'id'>>({
    assinaturaId: 0,
    valorPago: 0,
    dataPagamento: new Date().toISOString().split('T')[0],
    metodoPagamento: 'PIX',
    idTransacaoGateway: gerarTransacao(),
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([pagamentoService.getAll(), assinaturaService.getAll()]).then(([p, a]) => {
      setPagamentos(p);
      setAssinaturas(a);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await pagamentoService.update(editId, form);
    } else {
      await pagamentoService.create({ ...form, idTransacaoGateway: gerarTransacao() });
    }
    setForm({ assinaturaId: 0, valorPago: 0, dataPagamento: new Date().toISOString().split('T')[0], metodoPagamento: 'PIX', idTransacaoGateway: gerarTransacao() });
    setEditId(null);
    load();
  };

  const handleEdit = (p: Pagamento) => {
    setForm({ assinaturaId: p.assinaturaId, valorPago: p.valorPago, dataPagamento: p.dataPagamento, metodoPagamento: p.metodoPagamento, idTransacaoGateway: p.idTransacaoGateway });
    setEditId(p.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este pagamento?')) return;
    await pagamentoService.remove(id);
    load();
  };

  return (
    <div className="page-container">
      <div className="page-header"><h2>Pagamentos</h2></div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Pagamento' : 'Registrar Pagamento'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Assinatura</label>
                <select className="form-select" value={form.assinaturaId} onChange={e => setForm({ ...form, assinaturaId: +e.target.value })} required>
                  <option value={0}>Selecione...</option>
                  {assinaturas.map(a => <option key={a.id} value={a.id}>Assinatura #{a.id} — Usuário {a.usuarioId}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Valor Pago (R$)</label>
                <input type="number" step="0.01" className="form-control" value={form.valorPago} onChange={e => setForm({ ...form, valorPago: +e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Método de Pagamento</label>
                <select className="form-select" value={form.metodoPagamento} onChange={e => setForm({ ...form, metodoPagamento: e.target.value })}>
                  {METODOS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Data</label>
                <input type="date" className="form-control" value={form.dataPagamento} onChange={e => setForm({ ...form, dataPagamento: e.target.value })} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">ID Transação</label>
                <input className="form-control" value={form.idTransacaoGateway} readOnly />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Registrar'}</button>
              {editId && <button type="button" className="btn btn-secondary" onClick={() => { setForm({ assinaturaId: 0, valorPago: 0, dataPagamento: new Date().toISOString().split('T')[0], metodoPagamento: 'PIX', idTransacaoGateway: gerarTransacao() }); setEditId(null); }}>Cancelar</button>}
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
                <tr><th>#</th><th>Assinatura</th><th>Valor</th><th>Método</th><th>Data</th><th>ID Transação</th><th style={{ width: 100 }}>Ações</th></tr>
              </thead>
              <tbody>
                {pagamentos.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>#{p.assinaturaId}</td>
                    <td>R$ {p.valorPago.toFixed(2)}</td>
                    <td>{p.metodoPagamento}</td>
                    <td>{p.dataPagamento}</td>
                    <td><code>{p.idTransacaoGateway}</code></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {pagamentos.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">Nenhum pagamento registrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
