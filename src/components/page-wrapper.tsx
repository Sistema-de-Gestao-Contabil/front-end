import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col mt-5 px-4 space-y-5 bg-white flex-grow pb-4 mx-5">
      {children}
    </div>
  );
}
