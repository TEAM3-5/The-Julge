import { Suspense } from 'react';
import JeongdaeContent from './JeongdaeContent';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <JeongdaeContent />
    </Suspense>
  );
}
