export default function Jeongdae() {
  return (
    <div className="min-h-screen bg-gray-5 py-12 flex flex-col gap-y-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="mb-4 text-xl font-semibold text-gray-black">컬러 팔레트</h1>
        <div className="w-full max-w-2xl rounded-lg bg-white shadow p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-40 mb-6">
              배경색 ( bg- 로 시작 ) / 폰트색 ( font- 로 시작 )
            </h3>
            <h2 className="text-sm font-semibold text-gray-50">Gray</h2>
            <div className="flex flex-wrap gap-3">
              <ColorChip name="gray-black" className="bg-gray-black" />
              <ColorChip name="gray-50" className="bg-gray-50" />
              <ColorChip name="gray-40" className="bg-gray-40" />
              <ColorChip name="gray-30" className="bg-gray-30" />
              <ColorChip name="gray-20" className="bg-gray-20" />
              <ColorChip name="gray-10" className="bg-gray-10" />
              <ColorChip name="gray-5" className="bg-gray-5" />
              <ColorChip name="white" className="bg-white border border-gray-20" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Red</h2>
            <div className="flex flex-wrap gap-3">
              <ColorChip name="red-40" className="bg-red-40" />
              <ColorChip name="red-30" className="bg-red-30" />
              <ColorChip name="red-20" className="bg-red-20" />
              <ColorChip name="red-10" className="bg-red-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Blue</h2>
            <div className="flex flex-wrap gap-3">
              <ColorChip name="blue-20" className="bg-blue-20" />
              <ColorChip name="blue-10" className="bg-blue-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Green</h2>
            <div className="flex flex-wrap gap-3">
              <ColorChip name="green-20" className="bg-green-20 text-white" />
              <ColorChip name="green-10" className="bg-green-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Kakao</h2>
            <div className="flex flex-wrap gap-3">
              <ColorChip name="kakao" className="bg-kakao" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="mb-4 text-xl font-semibold text-gray-black">컴포넌트</h1>
        <div className="w-full max-w-2xl rounded-lg bg-white shadow p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-50">Table</h2>
            <p className="text-xs font-semibold text-gray-40">테이블 컴포넌트</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-50">Filter</h2>
            <p className="text-xs font-semibold text-gray-40">필터 컴포넌트</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type ColorChipProps = {
  name: string;
  className?: string;
};

function ColorChip({ name, className = '' }: ColorChipProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`h-10 w-24 rounded-md border border-gray-20 ${className}`} />
      <span className="text-xs text-gray-50">{name}</span>
    </div>
  );
}
