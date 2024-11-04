import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="text-sm font-medium">{`Date: ${label}`}</p>
        <p className="text-sm text-brand-600">{`Events: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;

// Start of Selection
};

interface EventTrendChartProps {
  data: Array<{ date: string; count: number }>;
}

export const EventTrendChart: React.FC<EventTrendChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
      <XAxis dataKey="date" stroke="#6B7280" />
      <YAxis stroke="#6B7280" />
      <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
      <Legend />
      <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
    </LineChart>
  </ResponsiveContainer>

// Start of Selection
);

interface EventDistributionChartProps {
  data: Array<{ name: string; value: number }>;
}

export const EventDistributionChart: React.FC<EventDistributionChartProps> = ({ data }) => {
  const COLORS = ['#7C3AED', '#4F46E5', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};