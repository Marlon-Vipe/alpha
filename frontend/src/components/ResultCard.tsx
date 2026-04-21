import type { InvestmentResult, Product } from '../types';

interface Props {
  result: InvestmentResult | null;
  products: Product[];
}

function formatDate(dateStr: string): string {
  const [datePart] = dateStr.split(' ');
  const [y, m, d] = datePart.split('-');
  return `${d}/${m}/${y}`;
}

export default function ResultCard({ result, products }: Props) {
  if (!result) {
    return (
      <div className="card" style={{ gridRow: 'span 1' }}>
        <div className="card-title">Resultado</div>
        <div className="result-empty">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Complete el formulario y presione<br /><strong>Calcular</strong> para ver los resultados.</p>
        </div>
      </div>
    );
  }

  const productName = products.find((p) => p.id === result.producto)?.name ?? `Producto ${result.producto}`;

  return (
    <div className="card">
      <div className="card-title">Resultado</div>
      <div className="result-grid">
        <div className="result-item result-product">
          <div className="label">Producto</div>
          <div className="value">{productName}</div>
        </div>

        <div className="result-item">
          <div className="label">Fecha Inicio</div>
          <div className="value">{formatDate(result.fechaInicio)}</div>
        </div>

        <div className="result-item">
          <div className="label">Fecha Fin</div>
          <div className="value">{formatDate(result.fechaFin)}</div>
        </div>

        <div className="result-item">
          <div className="label">Plazo Solicitado</div>
          <div className="value">{result.plazo} días</div>
        </div>

        <div className="result-item highlight">
          <div className="label">Plazo Real</div>
          <div className="value">{result.plazoReal} días</div>
        </div>
      </div>
    </div>
  );
}
