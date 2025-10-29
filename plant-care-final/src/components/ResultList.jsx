import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Leaf, TrendingUp } from 'lucide-react';

export default function ResultList({ results, diagnosis }) {
  const navigate = useNavigate();

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6 mt-8">
      {/* 식별 결과 */}
      <section aria-label="식별 결과">
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">식별 결과</h2>
        <div className="grid gap-4">
          {results.map((item, idx) => (
            <Card key={item.id} className="rounded-2xl shadow-lg border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Leaf className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                  {item.name}
                  <span className="text-sm font-normal text-emerald-600">({item.id})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 신뢰도 Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700">신뢰도</span>
                    <span className="text-sm font-bold text-emerald-800">
                      {(item.conf * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={item.conf * 100} 
                    className="h-3 bg-emerald-100"
                    aria-label={`신뢰도 ${(item.conf * 100).toFixed(1)}%`}
                  />
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => navigate(`/care/${item.id}`)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                    aria-label={`${item.name} 관리법 보기`}
                  >
                    관리법 보기
                  </Button>
                  <Button
                    onClick={() => navigate(`/growth/${item.id}`)}
                    variant="outline"
                    className="flex-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50 rounded-full"
                    aria-label={`${item.name} 성장예측 보기`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
                    성장예측
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 진단 결과 */}
      {diagnosis && diagnosis.length > 0 && (
        <section aria-label="상태 진단">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">상태 진단</h2>
          <Card className="rounded-2xl shadow-lg border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <ul className="space-y-2" role="list">
                {diagnosis.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-amber-800">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

