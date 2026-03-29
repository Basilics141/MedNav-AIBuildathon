import Chart from 'chart.js/auto';

let radarChartInstance = null;

/**
 * Initializes or updates the Medical Radar Chart.
 * @param {'High' | 'Medium' | 'Low'} riskLevel 
 */
export function updateRadarChart(riskLevel) {
  const ctx = document.getElementById('healthRadarChart');
  const container = document.getElementById('radar-container');
  if (!ctx || !container) return;

  // Configuration based on risk level
  const config = {
    High: {
      color: 'rgba(239, 68, 68, 0.7)', // Red-500
      borderColor: 'rgba(220, 38, 38, 1)',
      glow: '0 0 40px rgba(220, 38, 38, 0.6)',
      min: 20, max: 45
    },
    Medium: {
      color: 'rgba(245, 158, 11, 0.7)', // Amber-500
      borderColor: 'rgba(217, 119, 6, 1)',
      glow: '0 0 40px rgba(217, 119, 6, 0.5)',
      min: 45, max: 75
    },
    Low: {
      color: 'rgba(6, 182, 212, 0.7)', // Cyan-500
      borderColor: 'rgba(8, 145, 178, 1)',
      glow: '0 0 40px rgba(8, 145, 178, 0.5)',
      min: 75, max: 95
    }
  };

  const current = config[riskLevel] || config.Low;

  // Apply glow to container
  container.style.boxShadow = current.glow;
  container.style.borderColor = current.borderColor;

  // Generate semi-random but relevant values
  const generateValue = () => Math.floor(Math.random() * (current.max - current.min + 1)) + current.min;
  const dataValues = [
    generateValue(), // Metabolizma
    generateValue(), // Bağışıklık
    generateValue(), // Hücresel Direnç
    generateValue(), // Enerji
    generateValue()  // Toksin Atımı
  ];

  const isMobile = window.innerWidth < 768;

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Metabolizma', 'Bağışıklık', 'Hücresel Direnç', 'Enerji', 'Toksin Atımı'],
      datasets: [{
        label: 'Klinik Sağlık İndeksi',
        data: dataValues,
        fill: true,
        backgroundColor: current.color,
        borderColor: current.borderColor,
        pointBackgroundColor: current.borderColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: current.borderColor,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: isMobile ? { left: 15, right: 15, top: 10, bottom: 10 } : 10
      },
      scales: {
        r: {
          angleLines: { color: 'rgba(0,0,0,0.1)' },
          grid: { color: 'rgba(0,0,0,0.1)' },
          pointLabels: {
            color: '#1f2937',
            padding: isMobile ? 5 : 12,
            font: { 
              size: isMobile ? 10.5 : 14, 
              weight: '700', 
              family: "'Inter', sans-serif" 
            }
          },
          ticks: { display: false, stepSize: 20 },
          min: 0,
          max: 100
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { size: 14 },
          bodyFont: { size: 14 },
          padding: 12,
          displayColors: false
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutQuart'
      }
    }
  });
}
