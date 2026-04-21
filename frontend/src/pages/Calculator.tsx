import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductos, calcularFechas } from '../services/api';
import { logout } from '../services/auth';
import { Producto, CalcularFechasOutput } from '../types';

const Calculator: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoId, setProductoId] = useState('');
  const [enReinversion, setEnReinversion] = useState(false);
  const [plazo, setPlazo] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [resultado, setResultado] = useState<CalcularFechasOutput | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError('Error al cargar los productos.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResultado(null);
    setLoading(true);
    try {
      const data = await calcularFechas({
        producto: Number(productoId),
        enReinversion,
        plazo: Number(plazo),
        fechaCreacion: fechaCreacion.replace('T', ' ') + ':00',
      });
      setResultado(data);
    } catch (err: any) {
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : 'Error al calcular las fechas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const productoSeleccionado = productos.find((p) => p.id === Number(productoId));

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandName}>Alpha<span style={styles.brandAccent}>P</span></span>
          <span style={styles.brandSub}>Inversiones</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Cerrar Sesión</button>
      </header>

      <main style={styles.main}>
        <div style={styles.grid}>
          {/* Formulario */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Calculadora de Fechas</h2>
            <p style={styles.cardSubtitle}>Complete los datos de la inversión</p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Producto</label>
                <select
                  value={productoId}
                  onChange={(e) => setProductoId(e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Seleccione un producto...</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                {productoSeleccionado && (
                  <span style={styles.hint}>
                    Horario operativo: {productoSeleccionado.horario_operativo}
                  </span>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Fecha y Hora de Creación</label>
                <input
                  type="datetime-local"
                  value={fechaCreacion}
                  onChange={(e) => setFechaCreacion(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Plazo (días)</label>
                <input
                  type="number"
                  value={plazo}
                  onChange={(e) => setPlazo(e.target.value)}
                  style={styles.input}
                  placeholder="Ej: 33"
                  min={1}
                  required
                />
              </div>

              <div style={styles.checkboxField}>
                <input
                  type="checkbox"
                  id="reinversion"
                  checked={enReinversion}
                  onChange={(e) => setEnReinversion(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="reinversion" style={styles.checkboxLabel}>
                  Es una reinversión
                </label>
              </div>

              {error && <div style={styles.errorBox}>{error}</div>}

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'Calculando...' : 'Calcular Fechas'}
              </button>
            </form>
          </div>

          {/* Resultado */}
          {resultado && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <h2 style={styles.resultTitle}>Resultado</h2>
                <span style={styles.badge}>Calculado</span>
              </div>

              <div style={styles.resultGrid}>
                <ResultRow label="Producto ID" value={String(resultado.producto)} />
                <ResultRow label="Plazo solicitado" value={`${resultado.plazo} días`} />
                <ResultRow
                  label="Fecha Inicio"
                  value={resultado.fechaInicio}
                  highlight
                />
                <ResultRow
                  label="Fecha Fin"
                  value={resultado.fechaFin}
                  highlight
                />
                <ResultRow
                  label="Plazo Real"
                  value={`${resultado.plazoReal} días`}
                  accent
                />
              </div>

              <div style={styles.note}>
                El plazo real puede diferir del solicitado por ajuste de días no laborables.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const ResultRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
  accent?: boolean;
}> = ({ label, value, highlight, accent }) => (
  <div style={rowStyles.row}>
    <span style={rowStyles.label}>{label}</span>
    <span
      style={{
        ...rowStyles.value,
        ...(highlight ? rowStyles.highlight : {}),
        ...(accent ? rowStyles.accent : {}),
      }}
    >
      {value}
    </span>
  </div>
);

const rowStyles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: 500,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 600,
  },
  highlight: {
    color: '#1a2a4a',
    background: '#eef2ff',
    padding: '3px 10px',
    borderRadius: 6,
  },
  accent: {
    color: '#fff',
    background: '#1a2a4a',
    padding: '4px 12px',
    borderRadius: 6,
    fontSize: 15,
  },
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #1a2a4a, #2d4a7a)',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  brandName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#c8a84b',
  },
  brandSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 6,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  },
  main: {
    padding: '32px',
    maxWidth: 1000,
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a2a4a',
    margin: '0 0 4px',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    margin: '0 0 28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    color: '#333',
  },
  select: {
    padding: '11px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    background: '#fff',
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  checkboxField: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
    accentColor: '#1a2a4a',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    cursor: 'pointer',
  },
  button: {
    padding: '13px',
    background: 'linear-gradient(135deg, #1a2a4a, #2d4a7a)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
  errorBox: {
    padding: '10px 14px',
    background: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: 8,
    color: '#c53030',
    fontSize: 13,
  },
  resultCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    alignSelf: 'start',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a2a4a',
    margin: 0,
  },
  badge: {
    background: '#d4edda',
    color: '#155724',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  resultGrid: {
    display: 'flex',
    flexDirection: 'column',
  },
  note: {
    marginTop: 20,
    padding: '10px 14px',
    background: '#fffbf0',
    border: '1px solid #f6e05e',
    borderRadius: 8,
    fontSize: 12,
    color: '#744210',
  },
};

export default Calculator;
