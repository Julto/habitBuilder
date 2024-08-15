// ProgressChart.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  category: string;
  averageStatus: number;
}

interface ProgressChartProps {
  dateRange: {
    start: Date;
    end: Date;
  };
  taskUpdated: boolean; // Prop to trigger data re-fetch
}

const ProgressChart: React.FC<ProgressChartProps> = ({ dateRange, taskUpdated }) => {
  const [data, setData] = useState<ProgressData[]>([]);

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange, taskUpdated]); // Re-fetch data whenever dateRange or taskUpdated changes

  const fetchData = async (range: { start: Date; end: Date }) => {
    const start = range.start.toISOString().split('T')[0];
    const end = range.end.toISOString().split('T')[0];

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/average-status?start=${start}&end=${end}`
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={520}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis tickFormatter={(tick) => `${tick}%`} domain={[0, 100]} />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Bar dataKey="averageStatus" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
