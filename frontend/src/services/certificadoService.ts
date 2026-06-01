const BASE = 'http://localhost:3001';

export interface Certificado {
  id?: number;
  usuarioId: number;
  cursoId: number;
  dataEmissao: string;
  codigo: string;
  cargaHoraria: number;
}

export const certificadoService = {
  getAll: (): Promise<Certificado[]> =>
    fetch(`${BASE}/certificados`).then(r => r.json()),

  getById: (id: number): Promise<Certificado> =>
    fetch(`${BASE}/certificados/${id}`).then(r => r.json()),

  create: (data: Omit<Certificado, 'id'>): Promise<Certificado> =>
    fetch(`${BASE}/certificados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Certificado>): Promise<Certificado> =>
    fetch(`${BASE}/certificados/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/certificados/${id}`, { method: 'DELETE' }).then(() => undefined),
};
