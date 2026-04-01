const PLANS = [
  {
    name: 'Individual',
    price: '$5',
    period: '/mo',
    desc: 'Perfect for solo projects and personal task management.',
    features: ['1 board', 'Unlimited tasks', 'Guest sessions', 'Basic analytics'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$10',
    period: '/mo',
    desc: 'For small teams that need to collaborate and stay aligned.',
    features: ['Unlimited boards', 'Up to 10 members', 'Team performance dashboard', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Organization',
    price: '$20',
    period: '/mo',
    desc: 'For larger teams that need advanced controls and reporting.',
    features: ['Everything in Team', 'Unlimited members', 'Admin controls', 'SSO & audit logs'],
    cta: 'Contact sales',
    highlight: false,
  },
];

export default function PricingModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/20 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-border shadow-card-drag animate-fade-slide-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-primary">Simple pricing</h2>
            <p className="text-sm text-ink-secondary mt-0.5">No hidden fees. Cancel anytime.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-secondary hover:bg-surface-column transition-colors btn-press"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
            </svg>
          </button>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4 p-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-5 transition-all ${
                plan.highlight
                  ? 'border-brand bg-brand text-white shadow-card-hover'
                  : 'border-border bg-white'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-white text-brand px-3 py-1 rounded-full border border-brand/20 shadow-card">
                  Most popular
                </span>
              )}
              <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-white/80' : 'text-ink-secondary'}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-0.5 mb-3">
                <span className={`font-display text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-ink-primary'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-white/70' : 'text-ink-secondary'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-xs mb-4 leading-relaxed ${plan.highlight ? 'text-white/70' : 'text-ink-secondary'}`}>
                {plan.desc}
              </p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={plan.highlight ? 'text-white' : 'text-brand'}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className={plan.highlight ? 'text-white/90' : 'text-ink-primary'}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full text-sm font-semibold py-2.5 rounded-btn transition-colors btn-press ${
                  plan.highlight
                    ? 'bg-white text-brand hover:bg-white/90'
                    : 'bg-brand text-white hover:bg-brand-hover'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
