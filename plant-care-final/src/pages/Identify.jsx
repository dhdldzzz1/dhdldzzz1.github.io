import { useState, useEffect } from 'react';
import { identifyPlant } from '../api/client';
import ResultList from '../components/ResultList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePersistedState } from '@/hooks/usePersistedState';
import { Loader2, Upload } from 'lucide-react';

export default function Identify() {
  const { toast } = useToast();
  
  // 영구 저장 상태 (뒤로가기 시 복원)
  const [preview, setPreview] = usePersistedState('identify-preview', '');
  const [result, setResult] = usePersistedState('identify-result', null);
  
  // 임시 상태
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    if (!f.type.startsWith('image/')) {
      toast({
        title: '이미지 파일만 업로드 가능합니다',
        description: 'jpg, png 등의 이미지 파일을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setFile(f);
    const previewUrl = URL.createObjectURL(f);
    setPreview(previewUrl);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file && !preview) {
      toast({
        title: '이미지를 선택해주세요',
        description: '식별할 식물 이미지를 업로드해야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      toast({
        title: '이미지를 다시 선택해주세요',
        description: '저장된 이미지로는 식별할 수 없습니다. 새로 업로드해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // 내부 AI 식별 (백엔드)
      const data = await identifyPlant([file]);
      setResult(data);

      toast({
        title: '식별 완료!',
        description: `${data.topK.length}개의 결과를 찾았습니다.`,
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Identify error:', error);
      const errorMsg = error.response?.data?.detail || '네트워크 오류가 발생했습니다.';
      toast({
        title: '식별 실패',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 미리보기 배경 스타일
  const bgStyle = preview
    ? {
        backgroundImage: `url(${preview})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">식물 종 식별/분류</h1>
          <p className="text-lg text-emerald-700">
            식물 사진 1장을 업로드하면 AI가 종을 식별하고 상태를 진단합니다.
          </p>
        </header>

        {/* 파일 업로드 = 미리보기 영역 */}
        <div className="space-y-6">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple={false}
            onChange={handleFileChange}
            className="hidden"
            aria-label="식물 이미지 업로드"
          />
          
          <label
            htmlFor="file-upload"
            className="block w-full aspect-video rounded-xl border-2 border-dashed border-emerald-300 bg-white cursor-pointer hover:bg-emerald-50 transition overflow-hidden"
            style={bgStyle}
          >
            {!preview && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <Upload className="w-16 h-16 mb-4 text-emerald-500" aria-hidden="true" />
                <p className="text-emerald-700 font-medium text-lg mb-2">
                  이미지 1장을 업로드하세요
                </p>
                <p className="text-emerald-600 text-sm">
                  클릭하여 파일 선택 (jpg, png 등)
                </p>
              </div>
            )}
          </label>

          {preview && (
            <p className="text-sm text-emerald-600 text-center">
              💡 다른 이미지로 변경하려면 위 영역을 클릭하세요
            </p>
          )}
        </div>

        {/* 식별 시작 버튼 */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSubmit}
            disabled={!preview || loading}
            className="px-10 py-6 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="식별 시작"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                식별 중...
              </>
            ) : (
              '식별 시작'
            )}
          </Button>
        </div>

        {/* 결과 표시 */}
        {result && <ResultList results={result.topK} diagnosis={result.diagnosis} />}
      </div>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            {/* 미리보기 이미지 동일 스타일 */}
            <div
              className="w-full aspect-video rounded-xl border border-emerald-200 mb-6"
              style={bgStyle}
            />
            
            {/* 로딩 메시지 */}
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-emerald-500 animate-spin" />
              <h3 className="text-xl font-bold text-emerald-800 mb-2">이미지 분석 중...</h3>
              <p className="text-emerald-600">
                AI가 식물을 식별하고 있습니다. 잠시만 기다려주세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

