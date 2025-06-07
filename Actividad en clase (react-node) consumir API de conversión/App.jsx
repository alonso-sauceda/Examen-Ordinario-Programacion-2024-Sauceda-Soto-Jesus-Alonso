// src/App.jsx
import { useState, useEffect } from 'react';

// Importa el archivo CSS si lo estás usando en tu proyecto
// import './App.css'; // Si tu actividad no lo requiere, puedes omitir esta línea o dejarla.

function App() {
  const [monedas, setMonedas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonedas = async () => {
      try {
        // Esta URL es para consumir tu API de Node.js de conversión de monedas.
        // Asegúrate de que tu backend de Node.js esté corriendo en http://localhost:3000
        // y que tenga la ruta GET /monedas
        const response = await fetch('http://localhost:3000/monedas'); 
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setMonedas(data);
      } catch (err) {
        console.error("Error al obtener las monedas:", err);
        setError("No se pudieron cargar las monedas. Asegúrate de que el servidor esté corriendo.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonedas();
  }, []);

  return (
    <div>
      <h1>API de Conversión de Monedas</h1>
      {loading && <p>Cargando monedas...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && monedas.length === 0 && (
        <p>No hay monedas disponibles en la API.</p>
      )}

      {!loading && !error && monedas.length > 0 && (
        <div>
          <h2>Monedas disponibles:</h2>
          <ul>
            {monedas.map((moneda, index) => (
              // Asegúrate que 'moneda' tiene un 'codigo' para la key,
              // o usa 'index' como fallback si no estás seguro de la estructura exacta.
              <li key={moneda.codigo || index}>
                {moneda.nombre} ({moneda.codigo}): 1 {moneda.codigo} = {moneda.tasa_a_mxn} MXN
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
