import React, { useState } from "react";
import { saveAs } from 'file-saver';

const defaultCentros = ["Centro Balmes", "Centro Sants"];
const defaultTipos = ["Luz", "Cerradura", "Humedad", "Puerta dañada", "Sensor alarma"];

export default function App() {
  const [incidencias, setIncidencias] = useState([]);
  const [centros, setCentros] = useState(defaultCentros);
  const [tipos, setTipos] = useState(defaultTipos);

  const [form, setForm] = useState({
    centro: centros[0],
    tipo: tipos[0],
    prioridad: "Media",
    descripcion: "",
    imagen: null,
    fecha: new Date().toLocaleDateString(),
    estado: "Abierta"
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm({ ...form, imagen: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const crearIncidencia = () => {
    setIncidencias([...incidencias, form]);
    setForm({
      ...form,
      descripcion: "",
      imagen: null,
      fecha: new Date().toLocaleDateString(),
      estado: "Abierta"
    });
  };

  const exportarCSV = () => {
    const encabezado = "Centro,Tipo,Prioridad,Descripción,Estado,Fecha\n";
    const filas = incidencias.map(i =>
      `${i.centro},${i.tipo},${i.prioridad},"${i.descripcion}",${i.estado},${i.fecha}`
    ).join("\n");
    const blob = new Blob([encabezado + filas], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "incidencias.csv");
  };

  return (
    <div className="p-4 max-w-5xl mx-auto text-sm font-sans">
      <img src="/image.png" alt="Logo" className="h-10 mb-4" />
      <h1 className="text-xl font-bold mb-4 text-red-600">Gestión de Incidencias – CABE Trasteros</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl shadow-sm bg-white mb-6">
        <select name="centro" onChange={handleChange} className="border p-2 rounded" value={form.centro}>
          {centros.map((c, i) => <option key={i}>{c}</option>)}
        </select>
        <select name="tipo" onChange={handleChange} className="border p-2 rounded" value={form.tipo}>
          {tipos.map((t, i) => <option key={i}>{t}</option>)}
        </select>
        <select name="prioridad" onChange={handleChange} className="border p-2 rounded" value={form.prioridad}>
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
        </select>
        <input name="imagen" type="file" accept="image/*" onChange={handleChange} />
        <textarea name="descripcion" onChange={handleChange} value={form.descripcion}
          placeholder="Descripción..." className="col-span-full border p-2 rounded" />
        <button onClick={crearIncidencia} className="bg-red-600 text-white p-2 rounded col-span-full hover:bg-red-700">
          Añadir incidencia
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <button onClick={exportarCSV} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          Exportar CSV
        </button>
        <button onClick={() => window.print()} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          Imprimir informe
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border text-xs">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Centro</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Prioridad</th>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map((i, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{i.centro}</td>
                <td className="p-2 border">{i.tipo}</td>
                <td className={`p-2 border ${
                  i.prioridad === "Alta" ? "text-red-600" :
                  i.prioridad === "Media" ? "text-yellow-600" :
                  "text-green-600"
                }`}>
                  {i.prioridad}
                </td>
                <td className="p-2 border">{i.descripcion}</td>
                <td className="p-2 border">{i.estado}</td>
                <td className="p-2 border">{i.fecha}</td>
                <td className="p-2 border">{i.imagen && <img src={i.imagen} alt="foto" className="h-10" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}