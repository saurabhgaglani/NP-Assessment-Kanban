export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-auto p-8 max-w-xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-display text-2xl font-bold text-ink-primary">Settings</h2>
          <span className="text-xs font-medium bg-amber-100 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">Placeholder</span>
        </div>
        <p className="text-sm text-ink-secondary">This page is a placeholder — settings functionality is coming soon.</p>
      </div>

      <div className="flex flex-col gap-4">
        {[
          { label: 'Account', desc: 'Manage your profile and session preferences.', icon: '👤' },
          { label: 'Notifications', desc: 'Configure email and in-app notification rules.', icon: '🔔' },
          { label: 'Integrations', desc: 'Connect Slack, GitHub, and other tools.', icon: '🔗' },
          { label: 'Billing', desc: 'View your plan, invoices, and payment methods.', icon: '💳' },
          { label: 'Danger Zone', desc: 'Delete your account and all associated data.', icon: '⚠️', danger: true },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-4 bg-white border rounded-xl px-5 py-4 opacity-60 cursor-not-allowed select-none ${
              s.danger ? 'border-red-200' : 'border-border'
            }`}
          >
            <span className="text-xl shrink-0">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${s.danger ? 'text-red-500' : 'text-ink-primary'}`}>{s.label}</p>
              <p className="text-xs text-ink-secondary mt-0.5">{s.desc}</p>
            </div>
            <span className="text-xs text-ink-secondary border border-border rounded-full px-2 py-0.5 shrink-0">Soon</span>
          </div>
        ))}
      </div>
    </div>
  );
}
