import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden relative">
        {/* Декоративный розовый круг сверху */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-50 rounded-full blur-3xl -z-10"></div>
        <Outlet />
      </div>
    </div>
  );
}