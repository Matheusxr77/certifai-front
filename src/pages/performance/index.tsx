import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import Sidebar from '../../components/sidebar';
import { usePerformanceController } from './indexController';
import './styles.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformancePage: React.FC = () => {
    const { data, isLoading, error, refresh } = usePerformanceController();
    const [isSidebarExpanded, setSidebarExpanded] = React.useState(true);

    const toggleSidebar = () => setSidebarExpanded(prev => !prev);

    const chartData = {
        labels: data.map(item => item.provaNome),
        datasets: [
            {
                label: 'Média de Acertos',
                data: data.map(item => item.mediaAcertos ? Math.round(item.mediaAcertos * 100) : 0),
                backgroundColor: 'rgba(16, 185, 129, 0.7)'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: false }
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    callback: function(tickValue: string | number) {
                        return `${tickValue}%`;
                    }
                }
            }
        }
    };

    return (
        <div className={`performance-container${!isSidebarExpanded ? ' sidebar-collapsed' : ''}`}>
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <main className="performance-main-content">
                <div className="performance-wrapper">
                    <div className="performance-header">
                        <h1 className="performance-title">
                            <FiBarChart2 className="performance-title-icon" />
                            Relatório de Desempenho
                        </h1>
                        <button className="performance-refresh-btn" onClick={refresh} disabled={isLoading}>
                            <FiRefreshCw className={isLoading ? 'spinning' : ''} />
                            Atualizar
                        </button>
                    </div>
                    <div className="performance-content">
                        {isLoading ? (
                            <div className="performance-loading">Carregando...</div>
                        ) : error ? (
                            <div className="performance-error">{error}</div>
                        ) : (
                            <div className="performance-chart-wrapper">
                                <Bar data={chartData} options={options} />
                                <div className="performance-info-list">
                                    {data.map(item => (
                                        <div key={item.provaId} className="performance-info-item">
                                            <span className="performance-info-name">{item.provaNome}</span>
                                            <span className="performance-info-acertos">
                                                Média de acertos: <strong>{item.mediaAcertos ? (item.mediaAcertos * 100).toFixed(1) : '0'}%</strong>
                                            </span>
                                            <span className="performance-info-acertos">
                                                Acertos: <strong>{item.acertos}</strong>
                                            </span>
                                            <span className="performance-info-erros">
                                                Erros: <strong>{item.erros}</strong>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PerformancePage;
