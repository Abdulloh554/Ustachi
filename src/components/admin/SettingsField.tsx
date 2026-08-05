'use client'

export function SettingsField({ name, label, type, value, onChange }: {
  name: string
  label: string
  type: string
  value: string
  onChange: (name: string, value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1">{label}</span>
      {type === 'textarea' ? (
        <textarea
          className="input min-h-[70px]"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <input
          className="input"
          type={type === 'number' ? 'number' : 'text'}
          step={type === 'number' ? '0.01' : undefined}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
    </label>
  )
}

export function SettingsSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-sm mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}
