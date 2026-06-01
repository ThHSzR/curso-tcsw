import { useState, useEffect, useCallback } from 'react';
import { Modal }  from '../../components/Modal';
import { Toast }  from '../../components/Toast';
import { pagamentoService } from '../../services/pagamentoService';
import type { Pagamento }   from '../../services/pagamentoService';
import { usuarioService }   from '../../services/usuarioService';
import type { Usuario }     from '../../services/usuarioService';
import { assinaturaService } from '../../services/assinaturaService';
import type { Assinatura }   from '../../services/assinaturaService';

export function Pagamentos() {
  const [items, setItems]           = useState<Pagamento[]>([]);
  const [usuarios, setUsuarios]     = useState<Usuario[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [search, setSearch]         = useState('');
  const [modal, setModal]           = useState<'add'|'del'|null>(null);
  const [selected, setSelected]     = useState<Pagamento|null>(null);
  const [form, setForm]             = useState({ usuarioId: 0, assinaturaId: 0, valor: 0, metodo: 'pix' as Pagamento['metodo'], status: 'pendente' as Pagamento['status'], dataPagamento: '' });
  const [toast, setToast]           = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, u, a] = await Promise.all([pagamentoService.getAll(), usuarioService.getAll(), assinaturaService.getAll()]);
    setItems(p); setUsuarios(u); setAssinaturas(a); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getUser      = (id: number) => usuarios.find(u => u.id === id)?.nome ?? '-';
  const getAssinatura = (id: number) => { const a = assinaturas.find(a => a.id === id); return a ? `#${a.id} - ${a.status}` : '-'; };
  const statusBadge  = (s: string) => s === 'aprovado' ? 'badge-success' : s === 'recusado' ? 'badge-danger' : 'badge-warning';
  const metodoBadge  = (m: string) => m === 'pix' ? 'badge-success' : m === 'cartao' ? 'badge-muted' : 'badge-warning';

  const openAdd  = () => { setForm({ usuarioId: usuarios[0]?.id ?? 0, assinaturaId: assinaturas[0]?.id ?? 0, valor: 0, metodo: 'pix', status: 'pendente', dataPagamento: new Date().toISOString().slice(0,10) }); setModal('add'); };
  const openDel  = (p: Pagamento) => { setSelected(p); setModal('del'); };

  const save = async () => {
    try { await pagamentoService.create(form); await load(); setModal(null); setToast({ msg: 'Pagamento registrado!', type: 'success' }); }
    catch { setToast({ msg: 'Erro ao registrar', type: 'error' }); }
  };

  const del = async () => {
    try { await pagamentoService.remove(selected!.id!); await load(); setModal(null); setToast({ msg: 'Pagamento removido', type: 'success' }); }
    catch { setToast({ msg: 'Erro ao remover', type: 'error' }); }
  };

  const filtered = items.filter(i => getUser(i.usuarioId).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Pagamentos</h1><p className="page-subtitle">{items.length} pagamentos registrados</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Registrar Pagamento</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Histórico de pagamentos</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar usuário..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Usuário</th><th>Assinatura</th><th>Valor</th><th>Método</th><th>Status</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={8} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
              : filtered.length === 0
              ? <tr><td colSpan={8} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum pagamento</p></td></tr>
              : filtered.map(p => (
                <tr key={p.id}>
                  <td className="td-muted">{p.id}</td>
                  <td style={{ fontWeight: 500 }}>{getUser(p.usuarioId)}</td>
                  <td className="td-muted">{getAssinatura(p.assinaturaId)}</td>
                  <td>R$ {p.valor?.toFixed(2)}</td>
                  <td><span className={`badge ${metodoBadge(p.metodo)}`}>{p.metodo}</span></td>
                  <td><span className={`badge ${statusBadge(p.status)}`}>{p.status}</span></td>
                  <td className="td-muted">{p.dataPagamento}</td>
                  <td><button className="btn btn-danger btn-icon btn-sm" onClick={() => openDel(p)}><i className="bi bi-trash3"></i></button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {modal === 'add' && (
        <Modal title="Registrar Pagamento" onClose={() => setModal(null)} onConfirm={save}>
          <div className="field"><label>Usuário</label>
            <select className="select" value={form.usuarioId} onChange={e => setForm(f => ({ ...f, usuarioId: +e.target.value }))}>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </div>
          <div className="field"><label>Assinatura</label>
            <select className="select" value={form.assinaturaId} onChange={e => setForm(f => ({ ...f, assinaturaId: +e.target.value }))}>
              {assinaturas.map(a => <option key={a.id} value={a.id}>#{a.id} — {a.status}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label>Valor (R$)</label><input className="input" type="number" step="0.01" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: +e.target.value }))} /></div>
            <div className="field"><label>Data</label><input className="input" type="date" value={form.dataPagamento} onChange={e => setForm(f => ({ ...f, dataPagamento: e.target.value }))} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label>Método</label>
              <select className="select" value={form.metodo} onChange={e => setForm(f => ({ ...f, metodo: e.target.value as Pagamento['metodo'] }))}>
                <option value="pix">PIX</option><option value="cartao">Cartão</option><option value="boleto">Boleto</option>
              </select>
            </div>
            <div className="field"><label>Status</label>
              <select className="select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Pagamento['status'] }))}>
                <option value="pendente">Pendente</option><option value="aprovado">Aprovado</option><option value="recusado">Recusado</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'del' && (
        <Modal title="Confirmar exclusão" onClose={() => setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{ color: 'var(--text-muted)' }}>Excluir pagamento <strong style={{ color: 'var(--text)' }}>#{selected?.id}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</div>
    </div>
  );
}
