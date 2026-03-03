// hooks/useResumenFinanciero.js
import { useState, useEffect } from 'react';

export const useResumenFinanciero = () => {
  const [deudaTotal, setDeudaTotal] = useState(0);
  const [gastado, setGastado] = useState(0);
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      // Datos mock
      setDeudaTotal(150.75);
      setGastado(4500);
      setPresupuestoTotal(10000);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { deudaTotal, gastado, presupuestoTotal, loading, error };
};