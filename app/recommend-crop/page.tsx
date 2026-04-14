'use client'

import { useState, useCallback } from 'react'
import { Sprout, Loader2, ChevronDown, ChevronUp, Star, Clock, TrendingUp, MapPin, Thermometer, Droplets, CloudRain, FlaskConical, Info, Zap, LocateFixed } from 'lucide-react'

interface FormState {
  nitrogen: string
  phosphorus: string
  potassium: string
  temperature: string
  humidity: string
  ph: string
  rainfall: string
  location: string
  season: string
}

interface CropRec {
  crop: string
  suitabilityScore: number
  reason: string
  growingPeriod: string
  expectedYield: string
  tips: string[]
}

const SEASONS = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year-round']
const EMPTY: FormState = { nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: '', location: '', season: '' }

// Quick-fill presets so users don't have to know values
const PRESETS = [
  { label: '🌾 Rice Paddy',   values: { nitrogen: '80', phosphorus: '40', potassium: '40', temperature: '28', humidity: '80', ph: '6.0', rainfall: '1200', location: 'Tamil Nadu, India', season: 'Kharif (Monsoon)' } },
  { label: '🌽 Dryland Farm', values: { nitrogen: '50', phosphorus: '25', potassium: '30', temperature: '25', humidity: '55', ph: '6.5', rainfall: '700', location: 'Maharashtra, India', season: 'Kharif (Monsoon)' } },
  { label: '🥦 Winter Veg',   values: { nitrogen: '60', phosphorus: '45', potassium: '50', temperature: '18', humidity: '65', ph: '6.8', rainfall: '500', location: 'Punjab, India', season: 'Rabi (Winter)' } },
  { label: '☀️ Summer Crop',  values: { nitrogen: '40', phosphorus: '20', potassium: '35', temperature: '35', humidity: '45', ph: '7.0', rainfall: '400', location: 'Rajasthan, India', season: 'Zaid (Summer)' } },
]

const FIELD_HELP: Record<string, string> = {
  nitrogen:    'Soil nitrogen (N). Typical range: 40–120 kg/ha. Low = pale leaves. If unsure, use 60.',
  phosphorus:  'Soil phosphorus (P). Typical range: 15–60 kg/ha. Affects root & flower development. If unsure, use 35.',
  potassium:   'Soil potassium (K). Typical range: 20–60 kg/ha. Affects fruit quality. If unsure, use 40.',
  temperature: 'Average daytime temperature in °C. Check your local weather app.',
  humidity:    'Average relative humidity %. Coastal areas ~75–85%, inland ~45–65%.',
  ph:          'Soil pH scale 0–14. Most crops prefer 6–7.5. Neutral is 7. If unsure, use 6.5.',
  rainfall:    'Annual or seasonal rainfall in mm. Monsoon India ~800–2000mm, dry regions ~300–600mm.',
  location:    'Your district, state, or region. Helps AI tailor recommendations to local climate.',
}

const CROP_EMOJIS: Record<string, string> = {
  rice: '🌾', wheat: '🌾', maize: '🌽', corn: '🌽', cotton: '🌿', sugarcane: '🎋',
  potato: '🥔', tomato: '🍅', onion: '🧅', soybean: '🫘', groundnut: '🥜',
  sunflower: '🌻', jowar: '🌾', bajra: '🌾', ragi: '🌾', lentil: '🫘',
  chickpea: '🫘', mustard: '🌿', banana: '🍌', mango: '🥭',
}
const getCropEmoji = (name: string) => {
  const lower = name.toLowerCase()
  for (const [key, emoji] of Object.entries(CROP_EMOJIS)) {
    if (lower.includes(key)) return emoji
  }
  return '🌱'
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

export default function RecommendCropPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [results, setResults] = useState<CropRec[]>([])
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<number | null>(0)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  const handleChange = useCallback((field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }, [])

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setForm(prev => ({ ...prev, ...preset.values }))
    setResults([])
    setError('')
  }

  const autoFillLocation = async () => {
    setLocating(true)
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
      )
      const { latitude, longitude } = pos.coords
      // Reverse geocode using OpenStreetMap (free, no key needed)
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
      const geo = await r.json()
      const state = geo.address?.state || ''
      const country = geo.address?.country || ''
      const place = [state, country].filter(Boolean).join(', ')
      if (place) setForm(prev => ({ ...prev, location: place }))

      // Also fetch weather from OWM if key is available
      const owmKey = process.env.NEXT_PUBLIC_OWM_API_KEY || '20d3e2866bcce3455d318761421bf94a'
      if (owmKey) {
        const wr = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${owmKey}&units=metric`)
        const wx = await wr.json()
        if (wx.main) {
          setForm(prev => ({
            ...prev,
            location: place,
            temperature: Math.round(wx.main.temp).toString(),
            humidity: Math.round(wx.main.humidity).toString(),
          }))
        }
      }
    } catch {
      setError('Could not detect location. Please enter it manually.')
    } finally {
      setLocating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults([])
    setExpanded(0)
    try {
      const res = await fetch('/api/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nitrogen: parseFloat(form.nitrogen) || 60,
          phosphorus: parseFloat(form.phosphorus) || 35,
          potassium: parseFloat(form.potassium) || 40,
          temperature: parseFloat(form.temperature) || 25,
          humidity: parseFloat(form.humidity) || 60,
          ph: parseFloat(form.ph) || 6.5,
          rainfall: parseFloat(form.rainfall) || 800,
          location: form.location,
          season: form.season,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get recommendations')
      setResults(data.recommendations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s: number) =>
    s >= 85 ? ['bg-emerald-100 text-emerald-800', 'bg-emerald-500'] :
    s >= 70 ? ['bg-amber-100 text-amber-800', 'bg-amber-500'] :
              ['bg-orange-100 text-orange-800', 'bg-orange-500']

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]/40 focus:border-[#0A4D3C] text-sm transition-colors"

  return (
    <main className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)' }}>
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sprout className="w-4 h-4" /> AI-Powered Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Crop Recommendation</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Enter your soil and climate data — our AI recommends the best crops for maximum yield</p>
        </div>

        {/* Quick presets */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-3 flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Quick Start — tap a preset to auto-fill typical values
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p)} type="button"
                className="px-4 py-2 bg-white border border-gray-200 hover:border-[#0A4D3C]/50 hover:bg-green-50 rounded-xl text-sm font-medium text-gray-700 transition-all shadow-sm hover:shadow">
                {p.label}
              </button>
            ))}
            <button type="button" onClick={() => { setForm(EMPTY); setResults([]); setError('') }}
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
                  <FlaskConical className="w-4 h-4" /> Soil & Environment Data
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* NPK */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Soil Nutrients (kg/ha)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['nitrogen', 'phosphorus', 'potassium'] as const).map((field, i) => (
                      <div key={field}>
                        <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                          {['N', 'P', 'K'][i]}
                          <Tooltip text={FIELD_HELP[field]} />
                        </label>
                        <input
                          type="number" min="0" max="300" step="1"
                          placeholder={['60', '35', '40'][i]}
                          value={form[field]} onChange={handleChange(field)}
                          required className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 bg-gray-50 rounded-lg px-2 py-1.5">
                    💡 Don't have soil test data? Use a nearby agricultural office or tap a preset above.
                  </p>
                </div>

                {/* Climate */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Climate Conditions</p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                          <Thermometer className="w-3 h-3 mr-1" /> Temp (°C)
                          <Tooltip text={FIELD_HELP.temperature} />
                        </label>
                        <input type="number" min="-10" max="60" step="0.5" placeholder="25"
                          value={form.temperature} onChange={handleChange('temperature')} required className={inputCls} />
                      </div>
                      <div>
                        <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                          <Droplets className="w-3 h-3 mr-1" /> Humidity (%)
                          <Tooltip text={FIELD_HELP.humidity} />
                        </label>
                        <input type="number" min="0" max="100" step="1" placeholder="60"
                          value={form.humidity} onChange={handleChange('humidity')} required className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                          <FlaskConical className="w-3 h-3 mr-1" /> Soil pH
                          <Tooltip text={FIELD_HELP.ph} />
                        </label>
                        <input type="number" min="0" max="14" step="0.1" placeholder="6.5"
                          value={form.ph} onChange={handleChange('ph')} required className={inputCls} />
                      </div>
                      <div>
                        <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                          <CloudRain className="w-3 h-3 mr-1" /> Rainfall (mm)
                          <Tooltip text={FIELD_HELP.rainfall} />
                        </label>
                        <input type="number" min="0" max="5000" step="10" placeholder="800"
                          value={form.rainfall} onChange={handleChange('rainfall')} required className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location & Season</p>
                  <div className="space-y-2">
                    <div>
                      <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 mr-1" /> Region / State
                        <Tooltip text={FIELD_HELP.location} />
                      </label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="e.g. Tamil Nadu, India"
                          value={form.location} onChange={handleChange('location')} required
                          className={inputCls + ' flex-1'} />
                        <button type="button" onClick={autoFillLocation} disabled={locating}
                          title="Auto-detect my location & weather"
                          className="flex-shrink-0 px-2.5 py-2 border border-gray-200 rounded-lg hover:border-[#0A4D3C] hover:bg-green-50 transition-colors disabled:opacity-50">
                          {locating
                            ? <Loader2 className="w-4 h-4 animate-spin text-[#0A4D3C]" />
                            : <LocateFixed className="w-4 h-4 text-[#0A4D3C]" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">📍 Tap the pin to auto-fill location + temp + humidity</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Growing Season</label>
                      <select value={form.season} onChange={handleChange('season')} required
                        className={inputCls + ' bg-white'}>
                        <option value="">Select season...</option>
                        {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-[#0A4D3C] text-white py-3 rounded-xl hover:bg-[#083D2F] active:scale-95 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing conditions...</>
                    : <><Sprout className="w-4 h-4" /> Get Recommendations</>}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-[#0A4D3C] animate-spin" />
                  <Sprout className="w-6 h-6 text-[#0A4D3C] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-4 text-gray-500 font-medium">Analysing your soil data...</p>
                <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
              </div>
            )}

            {results.length > 0 && !loading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-800">Top Recommended Crops</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{results.length} matches found</span>
                </div>
                {results.map((rec, i) => {
                  const [badgeClass, barColor] = scoreColor(rec.suitabilityScore)
                  return (
                    <div key={i} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${expanded === i ? 'border-[#0A4D3C]/30 shadow-md' : 'border-gray-100'}`}>
                      <button onClick={() => setExpanded(expanded === i ? null : i)}
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors">
                        <div className="text-3xl">{getCropEmoji(rec.crop)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {i === 0 && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                            <p className="font-bold text-gray-900">{rec.crop}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rec.growingPeriod}</span>
                            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{rec.expectedYield}</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${rec.suitabilityScore}%`, background: barColor }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>{rec.suitabilityScore}%</span>
                          {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </button>
                      {expanded === i && (
                        <div className="px-4 pb-4 border-t border-gray-50">
                          <p className="text-sm text-gray-600 mt-3 mb-4 leading-relaxed">{rec.reason}</p>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Growing Tips</p>
                          <ul className="space-y-2">
                            {rec.tips.map((tip, j) => (
                              <li key={j} className="text-sm text-gray-600 flex items-start gap-2 bg-green-50 rounded-lg px-3 py-2">
                                <span className="text-[#0A4D3C] font-bold mt-0.5 flex-shrink-0">{j + 1}.</span>{tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {!loading && results.length === 0 && !error && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <Sprout className="w-10 h-10 text-green-300" />
                </div>
                <p className="font-semibold text-gray-600 mb-2">How to get started</p>
                <div className="text-left space-y-2 max-w-xs">
                  {['Tap a preset above to auto-fill typical values for your farm type', 'Or use the 📍 pin button to auto-detect your location & weather', 'Adjust any values you know, leave rest as defaults', 'Click "Get Recommendations" for AI crop suggestions'].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="w-5 h-5 bg-green-100 text-[#0A4D3C] rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
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
