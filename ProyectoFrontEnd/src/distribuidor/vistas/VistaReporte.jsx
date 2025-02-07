import React from "react";
import Header from "../../general/componentes/Header";
import "./VistaReporte.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register( CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const VistaReporte = () => {
    const ventasData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Venta",
                backgroundColor: "#36A2EB",
                data: [50000, 40000, 45000, 48000, 47000, 49000]
            },
            {
                label: "Compra",
                backgroundColor: "#4BC0C0",
                data: [30000, 32000, 35000, 33000, 34000, 36000]
            }
        ]
    };

    const pedidoData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                label: "Ordenado",
                borderColor: "#FF9F40",
                data: [3000, 2500, 2800, 2600, 2700],
                fill: false
            },
            {
                label: "Entregado",
                borderColor: "#36A2EB",
                data: [2500, 2200, 2400, 2300, 2500],
                fill: false
            }
        ]
    };

    return (
        <div className="distribuidor-reporte-app">
            <Header/>
            <div className="distribuidor-reporte-principal">
                <div className="resumen-seccion">
                    <div className="resumen-card">Ventas<br/><span>₹ 832</span></div>
                    <div className="resumen-card">Ingresos<br/><span>₹ 18,300</span></div>
                    <div className="resumen-card">Ganancias<br/><span>₹ 868</span></div>
                    <div className="resumen-card">Costos<br/><span>₹ 17,432</span></div>
                </div>
                <div className="graficos-seccion">
                    <div className="grafico-card">
                        <h3>Compra y Venta</h3>
                        <Bar data={ventasData} />
                    </div>
                    <div className="grafico-card">
                        <h3>Resumen de Pedido</h3>
                        <Line data={pedidoData} />
                    </div>
                </div>
                <div className="productos-seccion">
                    <div className="productos-card">
                        <h3>Productos más vendidos</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Cantidad Restante</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Tanque1</td>
                                    <td>30</td>
                                    <td>12</td>
                                    <td>$3.50</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="productos-card">
                        <h3>Stock de baja cantidad</h3>
                        <p>Tanque21 - GLP en cilindros Industrial <span className="bajo-stock">Bajo</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaReporte;
