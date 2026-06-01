const BASE = 'http://localhost:3001';

export interface Certificado {
  id?: number;
  usuarioId: number;
  cursoId: number;
  matriculaId: number;
  dataEmissao: string;
  codigo: string;
}

export interface Matricula {
  id?: number;
  usuarioId: number;
  cursoId: number;
  dataMatricula: string;
  progresso: number;
}

export const matriculaService = {
  getAll: (): Promise<Matricula[]> =>
    fetch(`${BASE}/matriculas`).then(r => r.json()),

  getByUsuario: (usuarioId: number): Promise<Matricula[]> =>
    fetch(`${BASE}/matriculas?usuarioId=${usuarioId}`).then(r => r.json()),

  create: (data: Omit<Matricula, 'id'>): Promise<Matricula> =>
    fetch(`${BASE}/matriculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id: number, data: Partial<Matricula>): Promise<Matricula> =>
    fetch(`${BASE}/matriculas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/matriculas/${id}`, { method: 'DELETE' }).then(() => undefined),
};

export const certificadoService = {
  getAll: (): Promise<Certificado[]> =>
    fetch(`${BASE}/certificados`).then(r => r.json()),

  getByUsuario: (usuarioId: number): Promise<Certificado[]> =>
    fetch(`${BASE}/certificados?usuarioId=${usuarioId}`).then(r => r.json()),

  getByCodigo: (codigo: string): Promise<Certificado[]> =>
    fetch(`${BASE}/certificados?codigo=${codigo}`).then(r => r.json()),

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
