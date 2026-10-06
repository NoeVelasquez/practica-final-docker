import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Award,
  Sparkles
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
      {/* Top Banner / IÃ­anfrastructure Bar */}
      <header className="system-header glass-panel">
        <div className="system-brand">
          <Layers className="icon-pulse text-cyan" size={26} />
          <div>
            <h1>Práctica Final Docker • CV Personal</h1>
            <p className="subtitle">Microservicios Orquestados • React + Node.js + MySQL 8.0</p>
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

      {/* Loading / Error States */}
      {loading && !data && (
        <div className="state-panel glass-panel loading-state">
          <div className="spinner"></div>
          <p>Consultando base de datos MySQL mediante la API de Node.js...</p>
        </div>
      )}

      {error && !data && (
        <div className="state-panel glass-panel error-state">
          <AlertCircle size={48} className="text-rose" />
          <h2>Error de Conexión</h2>
          <p>{error}</p>
          <p className="hint">Verifica que los contenedores estén activos con <code>docker compose ps</code>.</p>
          <button onClick={fetchCV} className="btn-retry">Reintentar Conexión</button>
        </div>
      )}

      {data && (
        <div className="cv-grid">
          {/* Columna Izquierda: Perfil Personal */}
          <section className="profile-card glass-panel">
            <div className="avatar-wrapper">
              <img 
                src={data.persona?.foto || 'https://raw.githubusercontent.com/NoeVelasquez/NoeVelasquez/main/profile.jpg'} 
                alt={`${data.persona?.nombre} ${data.persona?.apellido}`}
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="online-indicator" title="Base de Datos MySQL Conectada"></div>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">
                {data.persona?.nombre} <span className="text-cyan">{data.persona?.apellido}</span>
              </h2>
              <p className="profile-role">
                {data.persona?.profesion || 'Ingeniera de Sistemas | Especialista en QA'}
              </p>
              
              <div className="profile-meta">
                <span className="meta-item">
                  <MapPin size={16} className="text-cyan" />
                  {data.persona?.ciudad}
                </span>
                {data.persona?.email && (
                  <a href={`mailto:${data.persona.email}`} className="meta-link">
                    <Mail size={15} className="text-cyan" />
                    {data.persona.email}
                  </a>
                )}
                {data.persona?.telefono && (
                  <span className="meta-item">
                    <Phone size={15} className="text-cyan" />
                    {data.persona.telefono}
                  </span>
                )}
              </div>

              {/* Botones de Redes Sociales */}
              <div className="social-links">
                {data.persona?.linkedin && (
                  <a 
                    href={data.persona.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-social"
                    title="LinkedIn"
                  >
                    <Linkedin size={18} />
                    <span>LinkedIn</span>
                  </a>
                )}
                {data.persona?.github && (
                  <a 
                    href={data.persona.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-social"
                    title="GitHub"
                  >
                    <Github size={18} />
                    <span>GitHub</span>
                  </a>
                )}
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
                    <small>veravelasquez-frontend:v1 (:3000)</small>
                  </div>
                </div>
                <div className="stack-item">
                  <Cpu size={16} className="text-blue" />
                  <div>
                    <strong>Backend</strong>
                    <small>veravelasquez-backend:v1 (:4000)</small>
                  </div>
                </div>
                <div className="stack-item">
                  <Database size={16} className="text-emerald" />
                  <div>
                    <strong>Base de Datos</strong>
                    <small>mysql:8.0 (:3306) • Volumen: mysql_data</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Columna Derecha: Formación Académica & Áreas Clave */}
          <section className="education-card glass-panel">
            <div className="section-title">
              <GraduationCap size={28} className="text-cyan" />
              <div>
                <h2>Formación Académica</h2>
                <p>Datos recuperados en tiempo real desde la tabla <code>formacion</code> de MySQL</p>
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

            {/* Matriz de Competencias Clave del CV */}
            <div className="skills-overview">
              <div className="skills-header">
                <Sparkles size={18} className="text-cyan" />
                <h3>Áreas de Especialidad</h3>
              </div>
              <div className="tags-cloud">
                <span className="skill-tag">Quality Assurance (QA)</span>
                <span className="skill-tag">Testing de APIs (Postman)</span>
                <span className="skill-tag">Docker & Containers</span>
                <span className="skill-tag">Node.js & Express</span>
                <span className="skill-tag">PostgreSQL & MySQL</span>
                <span className="skill-tag">Gestión TAC & Educación Superior</span>
                <span className="skill-tag">Liderazgo de Equipos</span>
                <span className="skill-tag">Metodologías Ágiles (Scrum)</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer del Sistema */}
      <footer className="system-footer glass-panel">
        <div>
          <span>Estudiante: <strong>Noemi Rosio Vera Velasquez</strong></span>
          <span className="separator">•</span>
          <span>Orquestación: <code>docker-compose.yml</code></span>
          <span className="separator">•</span>
          <span>Persistencia: <code>mysql_data</code></span>
        </div>
        {lastFetched && <small className="text-muted">Última sincronización: {lastFetched}</small>}
      </footer>
    </main>
  );
}
