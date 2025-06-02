
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ScoreVisualizationProps {
  mergedScores: Record<string, number>;
}

export const ScoreVisualization: React.FC<ScoreVisualizationProps> = ({ mergedScores }) => {
  const chartData = Object.entries(mergedScores || {}).map(([metric, score]) => ({
    metric: metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: score * 100,
    value: score
  }));

  const radarData = chartData.map(item => ({
    metric: item.metric,
    score: item.score
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (!mergedScores || Object.keys(mergedScores).length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-400">
            Run an analysis to see score visualizations
          </p>
        </CardContent>
      </Card>
    );
  }

  const averageScore = Object.values(mergedScores).reduce((sum, score) => sum + score, 0) / Object.values(mergedScores).length * 100;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Score Overview</CardTitle>
          <CardDescription>
            Combined performance metrics across all ML services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg border-2 ${getScoreColor(averageScore)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                <div className="text-sm font-medium">Overall Score</div>
                <Badge variant="outline" className="mt-1">
                  {getScoreLabel(averageScore)}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(mergedScores).length}</div>
                <div className="text-sm font-medium text-blue-700">Metrics</div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...Object.values(mergedScores)).toFixed(2)}
                </div>
                <div className="text-sm font-medium text-purple-700">Best Score</div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.min(...Object.values(mergedScores)).toFixed(2)}
                </div>
                <div className="text-sm font-medium text-orange-700">Lowest Score</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.metric} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.score.toFixed(1)}%</span>
                    <Badge variant="outline" className={getScoreColor(item.score)}>
                      {getScoreLabel(item.score)}
                    </Badge>
                  </div>
                </div>
                <Progress value={item.score} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Bar Chart Analysis</CardTitle>
            <CardDescription>
              Comparative view of all metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="metric" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Score']}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="url(#gradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Radar Chart Analysis</CardTitle>
            <CardDescription>
              Multidimensional performance view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" fontSize={12} />
                  <PolarRadiusAxis domain={[0, 100]} tickCount={5} fontSize={10} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
