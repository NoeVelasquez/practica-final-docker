import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Server, 
  Database, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/cv';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchCV = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error en servidor (HTTP ${response.status})`);
      }
      const json = await response.json();
      setData(json);
      setLastFetched(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching CV:', err);
      setError(err.message || 'No se pudo conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCV();
  }, []);

  return (
    <main className="cv-container">
      {/* Top Banner / System Metadata */}
      <header className="system-header glass-panel">
        <div className="system-brand">
          <Layers className="icon-pulse text-cyan" size={24} />
          <div>
            <h1>Práctica Final Docker</h1>
            <p className="subtitle">Arquitectura Multicontenedor • React + Node.js + MySQL</p>
          </div>
        </div>

        <div className="header-actions">
          <span className="glow-pill">
            <CheckCircle2 size={14} className="text-emerald" />
            Red: cv_network
          </span>
          <button 
            onClick={fetchCV} 
            disabled={loading} 
            className="btn-refresh"
            title="Recargar datos desde MySQL"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            {loading ? 'Consultando...' : 'Actualizar'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {loading && !data && (
        <div className="state-panel glass-panel loading-state">
          <div className="spinner"></div>
          <p>Conectando con Backend Node.js y MySQL...</p>
        </div>
      )}

      {error && !data && (
        <div className="state-panel glass-panel error-state">
          <AlertCircle size={48} className="text-rose" />
          <h2>Error de Conexión</h2>
          <p>{error}</p>
          <p className="hint">Verifica que los contenedores de MySQL y Node.js estén corriendo en <code>docker-compose</code>.</p>
          <button onClick={fetchCV} className="btn-retry">Reintentar Conexión</button>
        </div>
      )}

      {data && (
        <div className="cv-grid">
          {/* Columna Izquierda: Perfil Personal */}
          <section className="profile-card glass-panel">
            <div className="avatar-wrapper">
              <img 
                src={data.persona?.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'} 
                alt={`${data.persona?.nombre} ${data.persona?.apellido}`}
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="online-indicator" title="Base de Datos Conectada"></div>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">
                {data.persona?.nombre} <span className="text-cyan">{data.persona?.apellido}</span>
              </h2>
              <div className="profile-meta">
                <span className="meta-item">
                  <MapPin size={16} className="text-cyan" />
                  {data.persona?.ciudad}
                </span>
                <span className="meta-item">
                  <User size={16} className="text-cyan" />
                  ID Registro: #{data.persona?.id}
                </span>
              </div>
            </div>

            <hr className="divider" />

            {/* Componentes de la Arquitectura */}
            <div className="stack-details">
              <h3>Servicios en Ejecución</h3>
              <div className="stack-badges">
                <div className="stack-item">
                  <Layers size={16} className="text-cyan" />
                  <div>
                    <strong>Frontend</strong>
                    <small>React + Nginx :3000</small>
                  </div>
                </div>
                <div className="stack-item">
                  <Cpu size={16} className="text-blue" />
                  <div>
                    <strong>Backend</strong>
                    <small>Node.js Express :4000</small>
                  </div>
                </div>
                <div className="stack-item">
                  <Database size={16} className="text-emerald" />
                  <div>
                    <strong>Database</strong>
                    <small>MySQL 8.0 :3306</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Columna Derecha: Formación Académica */}
          <section className="education-card glass-panel">
            <div className="section-title">
              <GraduationCap size={28} className="text-cyan" />
              <div>
                <h2>Formación Académica</h2>
                <p>Historial académico recuperado automáticamente desde MySQL</p>
              </div>
            </div>

            <div className="education-list">
              {data.formacion && data.formacion.length > 0 ? (
                data.formacion.map((item, index) => (
                  <article key={item.id || index} className="education-item">
                    <div className="timeline-marker">
                      <div className="marker-dot"></div>
                      {index !== data.formacion.length - 1 && <div className="marker-line"></div>}
                    </div>
                    <div className="education-content">
                      <div className="education-header">
                        <h3 className="edu-title">{item.titulo}</h3>
                        <span className="edu-year">
                          <Calendar size={13} />
                          {item.anio}
                        </span>
                      </div>
                      <p className="edu-institution">
                        <Building2 size={15} className="text-secondary" />
                        {item.institucion}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-message">No se encontraron registros de formación académica.</p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Footer con instrucciones y estado de la sincronización */}
      <footer className="system-footer glass-panel">
        <div>
          <span>Persistencia: <code>mysql_data (Volumen Docker)</code></span>
          <span className="separator">•</span>
          <span>Orquestación: <code>docker-compose.yml</code></span>
        </div>
        {lastFetched && <small className="text-muted">Última sincronización: {lastFetched}</small>}
      </footer>
    </main>
  );
}
