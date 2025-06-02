
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Search, Database, Activity } from 'lucide-react';
import { ServiceResults } from './ServiceResults';
import { ScoreVisualization } from './ScoreVisualization';
import { useMLTraceability } from '@/hooks/useMLTraceability';
import { toast } from 'sonner';

export const MLTraceabilityDashboard = () => {
  const [cid, setCid] = useState('');
  const { 
    results, 
    loading, 
    error, 
    fetchMLResults, 
    mergedScores 
  } = useMLTraceability();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cid.trim()) {
      toast.error('Please enter a valid CID');
      return;
    }
    
    console.log('Fetching ML results for CID:', cid);
    await fetchMLResults(cid);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ML Traceability Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Track and analyze machine learning model performance across multiple services
        </p>
      </div>

      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            CID Query Interface
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Enter a Content Identifier to fetch and analyze ML service responses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cid" className="text-sm font-medium">
                Content Identifier (CID)
              </Label>
              <div className="flex gap-3">
                <Input
                  id="cid"
                  type="text"
                  placeholder="e.g., QmYwAPJzv5CZsnAzt8auVvKzKwGF7V8wY6wukmWYgNYqC3"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  className="flex-1 h-12 text-base"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  className="h-12 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {(results.length > 0 || loading) && (
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border shadow-sm">
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Service Results
            </TabsTrigger>
            <TabsTrigger value="scores" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Score Analysis
            </TabsTrigger>
            <TabsTrigger value="merged" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Merged View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <ServiceResults results={results} loading={loading} />
          </TabsContent>

          <TabsContent value="scores" className="space-y-6">
            <ScoreVisualization mergedScores={mergedScores} />
          </TabsContent>

          <TabsContent value="merged" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Merged Analysis Results</CardTitle>
                <CardDescription>
                  Combined scores and insights from all ML services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mergedScores && Object.keys(mergedScores).length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(mergedScores).map(([metric, score]) => (
                        <div key={metric} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700 capitalize">
                              {metric.replace('_', ' ')}
                            </span>
                            <Badge variant="secondary">
                              {(score * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <Progress value={score * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Summary</h4>
                      <p className="text-green-700">
                        Analysis complete for CID: <code className="bg-green-100 px-2 py-1 rounded text-sm">{cid}</code>
                      </p>
                      <p className="text-green-600 mt-1 text-sm">
                        {results.length} services analyzed • {Object.keys(mergedScores).length} metrics computed
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No merged data available. Please run an analysis first.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!loading && results.length === 0 && !error && (
        <Card className="text-center py-12 border-dashed border-2 border-gray-200">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-gray-400">
              Enter a CID above to start tracing ML model performance across services
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
