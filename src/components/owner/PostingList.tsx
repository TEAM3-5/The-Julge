export function PostingList() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="tj-h1 text-gray-black">등록한 공고</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 rounded-3 border border-gray-20 bg-white px-4 py-4">
          <p className="tj-body2 text-primary">도토리식당</p>
          <p className="tj-body1-bold text-gray-black">주말 주방 보조 알바</p>
          <p className="tj-caption text-gray-60">2023.01.02 15:00–18:00 (3시간)</p>
          <p className="tj-caption text-gray-60">서울시 송파구</p>
          <p className="tj-body2-bold text-primary mt-1">시급 15,000원</p>
        </div>

        <div className="flex flex-col gap-2 rounded-3 border border-gray-20 bg-white px-4 py-4">
          <p className="tj-body2 text-primary">도토리식당</p>
          <p className="tj-body1-bold text-gray-black">평일 오후 서빙 알바</p>
          <p className="tj-caption text-gray-60">2023.01.05 17:00–21:00 (4시간)</p>
          <p className="tj-caption text-gray-60">서울시 송파구</p>
          <p className="tj-body2-bold text-primary mt-1">시급 14,000원</p>
        </div>

        <div className="flex flex-col gap-2 rounded-3 border border-gray-20 bg-white px-4 py-4">
          <p className="tj-body2 text-primary">도토리식당</p>
          <p className="tj-body1-bold text-gray-black">설거지 및 마감 알바</p>
          <p className="tj-caption text-gray-60">2023.01.07 19:00–23:00 (4시간)</p>
          <p className="tj-caption text-gray-60">서울시 송파구</p>
          <p className="tj-body2-bold text-primary mt-1">시급 15,000원</p>
        </div>
      </div>
    </section>
  );
}
