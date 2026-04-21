import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { apiService } from '../services/api';
import ResultCard from '../components/ResultCard';
import type { Product, InvestmentResult } from '../types';

export default function CalculatorPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [productoId, setProductoId] = useState('');
  const [enReinversion, setEnReinversion] = useState(false);
  const [plazo, setPlazo] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiService.getProducts().then((data) => {
      setProducts(data);
      if (data.length > 0) setProductoId(String(data[0].id));
    });
  }, []);

  function handleLogout() {
    authService.logout();
    navigate('/login');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      // Convert datetime-local value "YYYY-MM-DDTHH:mm" → "YYYY-MM-DD HH:MM:SS"
      const normalized = fechaCreacion.replace('T', ' ') + ':00';

      const data = await apiService.calculateDates({
        producto: Number(productoId),
        enReinversion,
        plazo: Number(plazo),
        fechaCreacion: normalized,
      });
      setResult(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(msg ?? 'Error al calcular las fechas. Verifique los datos ingresados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-brand">
          <span>Alpha</span> Inversiones
        </span>
        <button className="btn btn-outline" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>

      <div className="calculator-layout">
        {/* Form */}
        <div className="card">
          <div className="card-title">Datos de la Inversión</div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="producto">Producto</label>
              <select
                id="producto"
                className="form-control"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                required
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fechaCreacion">Fecha y Hora de Creación</label>
              <input
                id="fechaCreacion"
                className="form-control"
                type="datetime-local"
                value={fechaCreacion}
                onChange={(e) => setFechaCreacion(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="plazo">Plazo (días calendario)</label>
              <input
                id="plazo"
                className="form-control"
                type="number"
                min={1}
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                required
                placeholder="Ej. 33"
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  id="enReinversion"
                  type="checkbox"
                  checked={enReinversion}
                  onChange={(e) => setEnReinversion(e.target.checked)}
                />
                <label htmlFor="enReinversion">¿Es una reinversión?</label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Calculando...' : 'Calcular Fechas'}
            </button>
          </form>
        </div>

        {/* Result */}
        <ResultCard result={result} products={products} />
      </div>
    </>
  );
}
