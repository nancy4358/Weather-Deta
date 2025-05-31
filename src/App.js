import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom'; // 导入 Zoom 插件
import './App.css';

// 注册插件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin // 注册 Zoom 插件
);

function App() {
  const [city, setCity] = useState(''); // 选择的城市
  const [weatherData, setWeatherData] = useState(null); // 存储天气数据
  const [error, setError] = useState(''); // 错误信息

  const apiKey = 'b28b78a84193004136fcf06c4cd3c0a8'; // 替换为你的 OpenWeatherMap API 密钥

  const cityMapping = {
    '台灣': 'Taiwan',
    '倫敦': 'London',
    '紐約': 'New York',
    '東京': 'Tokyo',
    '巴黎': 'Paris',
    '悉尼': 'Sydney',
    '柏林': 'Berlin',
    '洛杉磯': 'Los Angeles',
    '北京': 'Beijing',
    '莫斯科': 'Moscow',
    '德里': 'Delhi'
  };
  const cities = Object.keys(cityMapping);

  const handleSearch = () => {
    if (!city) return;

    // 重置错误信息
    setError('');

    const cityInEnglish = cityMapping[city];

    // 发送 API 请求获取天气数据
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${cityInEnglish}&appid=${apiKey}&units=metric&lang=zh_tw`)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((err) => {
        setError('城市未找到，请重新选择');
        setWeatherData(null);
      });
  };

  // 温度图表数据
  const temperatureChartData = weatherData ? {
    labels: ['Temperature'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [weatherData.main.temp],
        backgroundColor: 'rgba(255, 87, 51, 0.6)',
        borderColor: '#ff5733',
        borderWidth: 1,
        fill: false,
      }
    ]
  } : {};

  // 湿度图表数据
  const humidityChartData = weatherData ? {
    labels: ['Humidity'],
    datasets: [
      {
        label: 'Humidity (%)',
        data: [weatherData.main.humidity],
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: '#4caf50',
        borderWidth: 1,
        fill: false,
      }
    ]
  } : {};

  // 风速图表数据
  const windSpeedChartData = weatherData ? {
    labels: ['Wind Speed'],
    datasets: [
      {
        label: 'Wind Speed (m/s)',
        data: [weatherData.wind.speed],
        backgroundColor: 'rgba(0, 188, 212, 0.6)',
        borderColor: '#00bcd4',
        borderWidth: 1,
        fill: false,
      }
    ]
  } : {};

  // 图表选项
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Weather Data Chart'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true, // 设置 y 轴从 0 开始
      }
    },
    zoom: {
      enabled: true, // 启用缩放功能
      mode: 'xy',    // 在 x 和 y 轴上都启用缩放
    }
  };

  const getCityNameInChinese = (englishName) => {
    const entry = Object.entries(cityMapping).find(([key, value]) => value === englishName);
    return entry ? entry[0] : englishName;
  };

  return (
    <div className="App">
      <h1>天氣</h1>

      {/* 下拉菜单选择城市 */}
      <select onChange={(e) => setCity(e.target.value)} value={city}>
        <option value="">選擇城市</option>
        {cities.map((cityName, index) => (
          <option key={index} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>

      <button style={{color:'#fff',marginLeft:'5px'} }  onClick={handleSearch}>查看天氣</button>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
        <h2>{getCityNameInChinese(weatherData.name)}</h2> 
          <p>{weatherData.weather[0].description}</p>
          <p>温度: {weatherData.main.temp}°C</p>
          <p>濕度: {weatherData.main.humidity}%</p>
          <p>風速: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {/* 创建一个包含所有图表的容器 */}
      {weatherData && (
        <div className="chart-container">
          <div className="chart-item">
            <h3>温度 (°C)</h3>
            <Bar data={temperatureChartData} options={chartOptions} />
          </div>

          <div className="chart-item">
            <h3>湿度 (%)</h3>
            <Bar data={humidityChartData} options={chartOptions} />
          </div>

          <div className="chart-item">
            <h3>風速 (m/s)</h3>
            <Bar data={windSpeedChartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
