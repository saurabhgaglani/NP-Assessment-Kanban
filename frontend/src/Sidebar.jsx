const NAV = [
  {
    id: 'board',
    label: 'Board',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="18" rx="2"/><rect x="14" y="3" width="7" height="10" rx="2"/><rect x="14" y="17" width="7" height="4" rx="2"/>
      </svg>
    ),
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'people',
    label: 'People',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function Sidebar({ boardName, activeNav, onNavChange, memberCount, onPricingClick }) {
  return (
    <aside className="flex flex-col w-56 min-h-screen bg-brand text-white shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <span className="font-display text-lg font-bold tracking-tight">
          {boardName || 'Kanban'}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`
                group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium
                transition-all duration-150 text-left btn-press
                ${active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
              )}
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.id === 'people' && memberCount > 0 && (
                <span className="text-xs bg-white/20 rounded-full px-1.5 py-0.5 leading-none">
                  {memberCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pricing CTA */}
      <div className="px-3 pb-3">
        <button
          onClick={onPricingClick}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-btn bg-white text-brand text-sm font-semibold shadow-card-hover hover:shadow-card-drag transition-all duration-150 btn-press"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.2)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Upgrade plan
        </button>
      </div>

      <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold shrink-0">
          G
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">Guest</p>
          <p className="text-xs text-white/50 truncate">Anonymous session</p>
        </div>
      </div>
    </aside>
  );
}
