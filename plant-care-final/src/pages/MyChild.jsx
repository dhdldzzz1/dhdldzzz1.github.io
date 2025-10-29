import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Droplet, 
  Sun, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MyChild() {
  const { toast } = useToast();
  
  // 스케줄 데이터 (localStorage에 영구 저장)
  const [schedules, setSchedules] = usePersistedState('mychild-schedules', []);
  
  // 폼 상태
  const [date, setDate] = useState('');
  const [type, setType] = useState('water'); // water | sun
  const [memo, setMemo] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // 필터 상태
  const [filter, setFilter] = useState('all'); // all | water | sun

  // 스케줄 추가/수정
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: '날짜를 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    if (editingId) {
      // 수정
      setSchedules(schedules.map(s => 
        s.id === editingId 
          ? { ...s, date, type, memo, updatedAt: new Date().toISOString() }
          : s
      ));
      toast({
        title: '수정 완료',
        description: '스케줄이 수정되었습니다.',
      });
      setEditingId(null);
    } else {
      // 추가
      const newSchedule = {
        id: Date.now(),
        date,
        type,
        memo,
        createdAt: new Date().toISOString(),
      };
      setSchedules([newSchedule, ...schedules]);
      toast({
        title: '등록 완료',
        description: '새로운 스케줄이 추가되었습니다.',
      });
    }

    // 폼 초기화
    setDate('');
    setType('water');
    setMemo('');
  };

  // 수정 모드
  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setDate(schedule.date);
    setType(schedule.type);
    setMemo(schedule.memo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 삭제
  const handleDelete = (id) => {
    if (confirm('이 스케줄을 삭제하시겠습니까?')) {
      setSchedules(schedules.filter(s => s.id !== id));
      toast({
        title: '삭제 완료',
        description: '스케줄이 삭제되었습니다.',
      });
    }
  };

  // CSV 내보내기
  const handleExportCSV = () => {
    if (schedules.length === 0) {
      toast({
        title: '데이터가 없습니다',
        description: '내보낼 스케줄이 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    const headers = ['날짜', '유형', '메모', '등록일시'];
    const rows = schedules.map(s => [
      s.date,
      s.type === 'water' ? '급수' : '일조',
      s.memo || '',
      new Date(s.createdAt).toLocaleString('ko-KR'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `우리아이_스케줄_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'CSV 다운로드 완료',
      description: '스케줄 데이터가 다운로드되었습니다.',
    });
  };

  // 필터링된 스케줄
  const filteredSchedules = schedules.filter(s => {
    if (filter === 'all') return true;
    return s.type === filter;
  });

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">우리아이 스케줄</h1>
          <p className="text-lg text-emerald-700">
            우리 식물의 일조와 급수 일정을 기록하고 관리하세요
          </p>
        </header>

        {/* 입력 폼 */}
        <Card className="rounded-2xl shadow-lg border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? '스케줄 수정' : '새 스케줄 추가'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    날짜
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-lg border-emerald-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">유형</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType('water')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 transition ${
                        type === 'water'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <Droplet className="w-4 h-4" />
                      급수
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('sun')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 transition ${
                        type === 'sun'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-300 hover:border-yellow-300'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      일조
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memo">메모 (선택)</Label>
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="예: 잎이 건조해 보여서 물을 줌"
                  className="rounded-lg border-emerald-200"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                >
                  {editingId ? '수정하기' : '추가하기'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setDate('');
                      setType('water');
                      setMemo('');
                    }}
                    className="rounded-lg"
                  >
                    취소
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 필터 & 내보내기 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-700" />
            <span className="text-sm font-medium text-emerald-800">필터:</span>
            <div className="flex gap-2">
              {[
                { value: 'all', label: '전체', icon: null },
                { value: 'water', label: '급수', icon: Droplet },
                { value: 'sun', label: '일조', icon: Sun },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    filter === f.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {f.icon && <f.icon className="w-3.5 h-3.5" />}
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV 내보내기
          </Button>
        </div>

        {/* 스케줄 표 */}
        <Card className="rounded-2xl shadow-lg border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">
              스케줄 목록 ({filteredSchedules.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSchedules.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <Calendar className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p>등록된 스케줄이 없습니다.</p>
                <p className="text-sm">위 폼에서 새로운 스케줄을 추가해보세요!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-emerald-200">
                      <th className="text-left py-3 px-4 text-emerald-800 font-bold">날짜</th>
                      <th className="text-center py-3 px-4 text-emerald-800 font-bold">유형</th>
                      <th className="text-left py-3 px-4 text-emerald-800 font-bold">메모</th>
                      <th className="text-center py-3 px-4 text-emerald-800 font-bold">편집</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchedules.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className="border-b border-emerald-100 hover:bg-emerald-50"
                      >
                        <td className="py-3 px-4 text-emerald-700 font-medium">
                          {schedule.date}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              schedule.type === 'water'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {schedule.type === 'water' ? (
                              <>
                                <Droplet className="w-3 h-3" />
                                급수
                              </>
                            ) : (
                              <>
                                <Sun className="w-3 h-3" />
                                일조
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-emerald-600">
                          {schedule.memo || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition"
                              aria-label="수정"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                              aria-label="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

