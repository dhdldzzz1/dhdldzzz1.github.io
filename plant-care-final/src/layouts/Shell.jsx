import { Link, NavLink, Outlet } from 'react-router-dom';

export default function Shell() {
  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-emerald-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
          {/* 로고 + 슬로건 - 클릭 시 홈으로 */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            {/* 새싹 아이 로고 - 새싹 + 원형 디자인 */}
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 원형 테두리 */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#8B9D83"
                  strokeWidth="3"
                  opacity="0.8"
                />
                {/* 새싹 줄기 */}
                <path
                  d="M 35 75 Q 35 50, 35 35"
                  fill="none"
                  stroke="#8B9D83"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* 왼쪽 잎 */}
                <path
                  d="M 35 45 Q 20 40, 25 25 Q 30 30, 35 35"
                  fill="#8B9D83"
                  opacity="0.7"
                />
                {/* 오른쪽 잎 */}
                <path
                  d="M 35 35 Q 45 25, 55 20 Q 50 30, 45 40 Q 40 37, 35 35"
                  fill="#99A894"
                  opacity="0.8"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-lg text-gray-800" style={{ letterSpacing: '0.02em' }}>새싹 아이</div>
              <div className="text-[10px] tracking-[0.25em] text-gray-500 font-light">PLANT-AI</div>
            </div>
          </Link>
          
          {/* 네비게이션 메뉴 */}
          <nav className="flex gap-4 text-sm font-medium">
            <NavLink 
              to="/identify" 
              className={({ isActive }) => 
                `hover:text-emerald-700 transition ${isActive ? 'text-emerald-700 font-semibold' : 'text-emerald-900'}`
              }
            >
              종 식별
            </NavLink>
            <NavLink 
              to="/mychild" 
              className={({ isActive }) => 
                `hover:text-emerald-700 transition ${isActive ? 'text-emerald-700 font-semibold' : 'text-emerald-900'}`
              }
            >
              우리아이
            </NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

