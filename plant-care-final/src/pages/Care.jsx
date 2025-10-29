import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCareById } from '../data/careDB';
import CareTips from '../components/CareTips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Droplet, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Care() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const care = getCareById(id);

  const [sunDate, setSunDate] = useState('');
  const [waterDate, setWaterDate] = useState('');
  const [memo, setMemo] = useState('');

  // 로컬스토리지에서 환경 기록 불러오기
  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(`care-record-${id}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSunDate(data.sunDate || '');
        setWaterDate(data.waterDate || '');
        setMemo(data.memo || '');
      } catch (e) {
        console.error('Failed to parse stored data:', e);
      }
    }
  }, [id]);

  // 환경 기록 저장
  function handleSave() {
    const record = { sunDate, waterDate, memo };
    localStorage.setItem(`care-record-${id}`, JSON.stringify(record));
    toast({
      title: '저장 완료',
      description: '나의 환경 기록이 저장되었습니다.',
      variant: 'default',
    });
  }

  // 404 처리
  if (!care) {
    return (
      <main className="w-full flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full rounded-2xl shadow-lg">
          <CardContent className="pt-10 pb-8 text-center space-y-4">
            <h1 className="text-3xl font-bold text-emerald-800">식물을 찾을 수 없습니다</h1>
            <p className="text-emerald-700">
              요청하신 식물 ID(<code className="bg-emerald-100 px-2 py-1 rounded">{id}</code>)에 대한
              관리법이 존재하지 않습니다.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
              aria-label="이전 페이지로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              뒤로가기
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 상단 헤더 */}
        <header className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-lg p-6">
          <img
            src={care.image}
            alt={`${care.name} 이미지`}
            className="w-32 h-32 rounded-xl object-cover shadow-md"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">{care.name}</h1>
            <p className="text-lg text-emerald-600 italic">{care.scientificName}</p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full"
            aria-label="이전 페이지로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            뒤로가기
          </Button>
        </header>

        {/* 관리법 상세 */}
        <CareTips care={care} />

        {/* 나의 환경 기록 */}
        <section aria-label="나의 환경 기록">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">나의 환경 기록</h2>
          <Card className="rounded-xl border-emerald-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-emerald-800">일조/급수 날짜 및 메모</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sun-date" className="flex items-center gap-2 text-emerald-700">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    마지막 일조 날짜
                  </Label>
                  <Input
                    id="sun-date"
                    type="date"
                    value={sunDate}
                    onChange={(e) => setSunDate(e.target.value)}
                    className="rounded-lg border-emerald-200 focus:ring-emerald-500"
                    aria-label="마지막 일조 날짜"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water-date" className="flex items-center gap-2 text-emerald-700">
                    <Droplet className="w-4 h-4" aria-hidden="true" />
                    마지막 급수 날짜
                  </Label>
                  <Input
                    id="water-date"
                    type="date"
                    value={waterDate}
                    onChange={(e) => setWaterDate(e.target.value)}
                    className="rounded-lg border-emerald-200 focus:ring-emerald-500"
                    aria-label="마지막 급수 날짜"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memo" className="flex items-center gap-2 text-emerald-700">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  메모
                </Label>
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="식물 상태나 특이사항을 기록하세요..."
                  className="rounded-lg border-emerald-200 focus:ring-emerald-500 min-h-[100px]"
                  aria-label="메모"
                />
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold"
                aria-label="환경 기록 저장"
              >
                저장하기
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

