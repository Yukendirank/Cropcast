'use client'

import { useState, useCallback } from 'react'
import { FlaskConical, Loader2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Calendar, Leaf, DollarSign, Zap, Info } from 'lucide-react'

interface FormState {
  cropName: string
  soilType: string
  nitrogen: string
  phosphorus: string
  potassium: string
  ph: string
  organicMatter: string
  cropStage: string
  previousCrop: string
  targetYield: string
  weatherCondition: string
  nutrientDeficiency: string
}

interface FertilizerSuggestion {
  fertilizer: string
  dosage: string
  application_method: string
  timing: string
  precautions: string[]
}

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky', 'Red laterite', 'Black cotton']
const STAGES = ['Pre-sowing', 'Germination', 'Vegetative', 'Flowering', 'Fruiting / Pod filling', 'Maturity']
const ORGANIC = ['Very Low (<1%)', 'Low (1–2%)', 'Medium (2–3%)', 'High (>3%)']
const EMPTY: FormState = { cropName: '', soilType: '', nitrogen: '', phosphorus: '', potassium: '', ph: '', organicMatter: '', cropStage: '', previousCrop: '', targetYield: '', weatherCondition: '', nutrientDeficiency: '' }

// Presets users can tap to instantly fill form
const PRESETS = [
  {
    label: '🌾 Rice – Loamy',
    values: { cropName: 'Rice', soilType: 'Loamy', nitrogen: '30', phosphorus: '12', potassium: '20', ph: '6.0', organicMatter: 'Low (1–2%)', cropStage: 'Pre-sowing', previousCrop: 'Legumes', targetYield: '5 t/ha', weatherCondition: '', nutrientDeficiency: '' }
  },
  {
    label: '🌽 Maize – Sandy',
    values: { cropName: 'Maize', soilType: 'Sandy', nitrogen: '20', phosphorus: '10', potassium: '15', ph: '6.5', organicMatter: 'Very Low (<1%)', cropStage: 'Vegetative', previousCrop: 'Fallow', targetYield: '4 t/ha', weatherCondition: '', nutrientDeficiency: '' }
  },
  {
    label: '🍅 Tomato – Clay',
    values: { cropName: 'Tomato', soilType: 'Clay', nitrogen: '25', phosphorus: '20', potassium: '30', ph: '6.8', organicMatter: 'Medium (2–3%)', cropStage: 'Flowering', previousCrop: 'Wheat', targetYield: '20 t/ha', weatherCondition: '', nutrientDeficiency: '' }
  },
  {
    label: '🌿 Sugarcane – Black',
    values: { cropName: 'Sugarcane', soilType: 'Black cotton', nitrogen: '40', phosphorus: '15', potassium: '25', ph: '6.5', organicMatter: 'Medium (2–3%)', cropStage: 'Vegetative', previousCrop: 'Rice', targetYield: '80 t/ha', weatherCondition: '', nutrientDeficiency: '' }
  },
]

const FIELD_HELP: Record<string, string> = {
  nitrogen:     'Current nitrogen in your soil (kg/ha). Get from soil test, or check with local agriculture office. Typical: 20–80 kg/ha.',
  phosphorus:   'Current phosphorus (kg/ha). Typical: 10–50 kg/ha. Low P causes poor root growth.',
  potassium:    'Current potassium (kg/ha). Typical: 15–50 kg/ha. Affects disease resistance and fruit quality.',
  ph:           'Soil pH (0–14 scale). Most crops need 6–7. Below 6 = acidic, above 7.5 = alkaline. If unknown, use 6.5.',
  previousCrop: 'Legumes (pulses, soybean) leave nitrogen behind — very helpful context for AI to reduce N recommendation.',
  targetYield:  'Your yield goal in t/ha or kg/ha. Realistic targets: Rice 4–6 t/ha, Wheat 3–5 t/ha, Maize 4–7 t/ha.',
}

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex">
      <button type="button" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)} onBlur={() => setShow(false)}
        className="text-gray-400 hover:text-[#0A4D3C] transition-colors ml-1 align-middle">
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-50 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  )
}

export default function FertilizerPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [result, setResult] = useState<FertilizerSuggestion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openSection, setOpenSection] = useState<string>('primary')

  const handleChange = useCallback((field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }, [])

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setForm(prev => ({ ...prev, ...preset.values }))
    setResult(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: form.cropName,
          soilType: form.soilType,
          nitrogen: parseFloat(form.nitrogen) || 0,
          phosphorus: parseFloat(form.phosphorus) || 0,
          potassium: parseFloat(form.potassium) || 0,
          ph: parseFloat(form.ph) || 6.5,
          organicMatter: form.organicMatter,
          cropStage: form.cropStage,
          previousCrop: form.previousCrop,
          targetYield: form.targetYield,
          weatherCondition: form.weatherCondition,
          nutrientDeficiency: form.nutrientDeficiency,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get suggestion')
      setResult(data.suggestion)
      setOpenSection('primary')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]/40 focus:border-[#0A4D3C] text-sm bg-white transition-colors"
  const labelCls = "flex items-center text-xs font-medium text-gray-600 mb-1"

  const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className={`rounded-xl border overflow-hidden transition-all ${openSection === id ? 'border-[#0A4D3C]/30 shadow-sm' : 'border-gray-100'}`}>
      <button onClick={() => setOpenSection(openSection === id ? '' : id)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50/50 text-left transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0A4D3C]/10 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#0A4D3C]" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
        </div>
        {openSection === id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {openSection === id && <div className="px-4 pb-4 bg-white border-t border-gray-50">{children}</div>}
    </div>
  )

  return (
    <main className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)' }}>
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <FlaskConical className="w-4 h-4" /> AI-Powered Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Fertilizer Suggestion</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Get a complete fertilizer plan tailored to your crop, soil, and growth stage</p>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-3 flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Quick Start — tap a preset to auto-fill common scenarios
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p)} type="button"
                className="px-4 py-2 bg-white border border-gray-200 hover:border-[#0A4D3C]/50 hover:bg-green-50 rounded-xl text-sm font-medium text-gray-700 transition-all shadow-sm hover:shadow">
                {p.label}
              </button>
            ))}
            <button type="button" onClick={() => { setForm(EMPTY); setResult(null); setError('') }}
              className="px-4 py-2 bg-white border border-dashed border-gray-300 hover:border-red-300 hover:bg-red-50 rounded-xl text-sm text-gray-400 hover:text-red-400 transition-all">
              Clear all
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#0A4D3C] px-6 py-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" /> Crop & Soil Details
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className={labelCls}>Crop Name</label>
                  <input type="text" placeholder="e.g. Rice, Wheat, Tomato, Sugarcane"
                    value={form.cropName} onChange={handleChange('cropName')} required className={inputCls} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Soil Type</label>
                    <select value={form.soilType} onChange={handleChange('soilType')} required className={inputCls}>
                      <option value="">Select...</option>
                      {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Organic Matter</label>
                    <select value={form.organicMatter} onChange={handleChange('organicMatter')} required className={inputCls}>
                      <option value="">Select...</option>
                      {ORGANIC.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Soil Nutrients (kg/ha)</p>
                  <p className="text-xs text-gray-400 mb-2 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
                    ⚠️ No soil test? Enter 0 for all — the AI will recommend based on crop needs alone.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['nitrogen', 'phosphorus', 'potassium'] as const).map((field, i) => (
                      <div key={field}>
                        <label className={labelCls}>
                          {['N', 'P', 'K'][i]}
                          <Tooltip text={FIELD_HELP[field]} />
                        </label>
                        <input type="number" min="0" max="300" step="1" placeholder="0"
                          value={form[field]} onChange={handleChange(field)} required className={inputCls} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      Soil pH
                      <Tooltip text={FIELD_HELP.ph} />
                    </label>
                    <input type="number" min="0" max="14" step="0.1" placeholder="6.5"
                      value={form.ph} onChange={handleChange('ph')} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Crop Stage</label>
                    <select value={form.cropStage} onChange={handleChange('cropStage')} required className={inputCls}>
                      <option value="">Select...</option>
                      {STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      Previous Crop
                      <Tooltip text={FIELD_HELP.previousCrop} />
                    </label>
                    <input type="text" placeholder="e.g. Rice, Legumes, Fallow"
                      value={form.previousCrop} onChange={handleChange('previousCrop')} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Target Yield
                      <Tooltip text={FIELD_HELP.targetYield} />
                    </label>
                    <input type="text" placeholder="e.g. 5 t/ha"
                      value={form.targetYield} onChange={handleChange('targetYield')} required className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Weather Condition</label>
                  <input type="text" placeholder="e.g. Warm, humid, light rain"
                    value={form.weatherCondition} onChange={handleChange('weatherCondition')} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Nutrient Deficiency</label>
                  <input type="text" placeholder="e.g. Nitrogen deficiency, yellowing leaves"
                    value={form.nutrientDeficiency} onChange={handleChange('nutrientDeficiency')} className={inputCls} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-[#0A4D3C] text-white py-3 rounded-xl hover:bg-[#083D2F] active:scale-95 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating plan...</>
                    : <><FlaskConical className="w-4 h-4" /> Get Fertilizer Plan</>}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

            {loading && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-[#0A4D3C] animate-spin" />
                  <FlaskConical className="w-6 h-6 text-[#0A4D3C] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-4 text-gray-500 font-medium">Building your fertilizer plan...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Recommended Fertilizer</p>
                      <h2 className="mt-2 text-2xl font-semibold text-gray-900">{result.fertilizer}</h2>
                    </div>
                    <div className="rounded-3xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-900">
                      <span className="font-semibold">Dosage:</span> {result.dosage}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <div className="rounded-3xl bg-green-50 p-4 border border-green-100">
                      <p className="text-xs text-green-700 uppercase tracking-[0.2em] mb-2">Application Method</p>
                      <p className="text-sm text-green-900">{result.application_method}</p>
                    </div>
                    <div className="rounded-3xl bg-blue-50 p-4 border border-blue-100">
                      <p className="text-xs text-blue-700 uppercase tracking-[0.2em] mb-2">Timing</p>
                      <p className="text-sm text-blue-900">{result.timing}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Precautions
                  </div>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {result.precautions?.map((item, idx) => (
                      <li key={idx} className="rounded-2xl bg-amber-50 border border-amber-100 p-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <FlaskConical className="w-10 h-10 text-purple-200" />
                </div>
                <p className="font-semibold text-gray-600 mb-2">How to get started</p>
                <div className="text-left space-y-2 max-w-xs">
                  {[
                    'Tap a preset above (e.g. 🌾 Rice – Loamy) to auto-fill a typical scenario',
                    'Enter 0 for N, P, K if you don\'t have a soil test — AI adjusts accordingly',
                    'Previous Crop and Crop Stage improve accuracy the most',
                    'Target Yield can be a rough estimate — e.g. "5 t/ha" or "moderate"'
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
