import React from 'react';
import { BarChart as Chart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const testData = [
  {
    grouping: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    grouping: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    grouping: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    grouping: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    grouping: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    grouping: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    grouping: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const colors = [
  "#42f",
  "#8884d8",
  "#900000",
  "#084",
  "#028",
]

const BarChart = ({ data = testData }) => (
  <Chart
    width={600}
    height={400}
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="grouping" />
    <YAxis />
    <Tooltip />
    <Legend />
    {Object
      .keys(data[0])
      .map((key, i) => key !== 'grouping' && <Bar key={key} dataKey={key} fill={colors[i]} /> )
    }
  </Chart>
);
  // <ResponsiveContainer width="100%" height="100%">
  // </ResponsiveContainer>

export default BarChart
