import { useState, useEffect } from "react"

function App() {
  const [skills, setSkills] = useState(() => localStorage.getItem("skills") || "")
  const [passport, setPassport] = useState(() => JSON.parse(localStorage.getItem("passport") || "[]"))
  const [results, setResults] = useState([])
  const [guide, setGuide] = useState(null)

  const findMatches = (skillText) => {
    fetch("http://localhost:8000/match?skills=" + encodeURIComponent(skillText))
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(() => alert("Backend connect nathi thayu"))
  }

  useEffect(() => {
    localStorage.setItem("skills", skills)
    localStorage.setItem("passport", JSON.stringify(passport))
  }, [skills, passport])

  useEffect(() => {
    if (skills) findMatches(skills)
  }, [])

  const openGuide = (name) => {
    fetch("http://localhost:8000/skill-guide?name=" + encodeURIComponent(name))
      .then((res) => res.json())
      .then((data) => setGuide({ name, ...data }))
  }

  const completeChallenge = () => {
    const newSkills = skills ? skills + ", " + guide.name : guide.name
    setPassport([...passport, guide.name])
    setSkills(newSkills)
    setGuide(null)
    findMatches(newSkills)
  }

  const resetAll = () => {
    setSkills("")
    setPassport([])
    setResults([])
    setGuide(null)
  }

  const barColor = (score) =>
    score === 100 ? "bg-green-500" : score >= 50 ? "bg-amber-400" : "bg-pink-500"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-10 text-center">
        <h1 className="text-4xl font-bold">Skill2Rise</h1>
        <p className="mt-2 text-purple-100">Learn → Practice → Showcase → Connect → Earn</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800">Tamara skills lakho</h2>
          <p className="text-sm text-gray-500 mb-3">Comma thi alag karo, jemke: excel, typing</p>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="excel, typing, communication"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => findMatches(skills)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl"
            >
              Find Opportunities
            </button>
            <button
              onClick={resetAll}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>

        {passport.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mt-6">
            <h3 className="font-semibold text-green-800 mb-2">🎓 Mari Skill Passport</h3>
            <div className="flex flex-wrap gap-2">
              {passport.map((p) => (
                <span key={p} className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                  ✅ {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {guide && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-6">
            <h3 className="font-semibold text-amber-800 text-lg">📘 {guide.name}</h3>
            <p className="mt-2 text-gray-700"><b>Shikho:</b> {guide.learn}</p>
            <p className="mt-2 text-gray-700"><b>Challenge:</b> {guide.challenge}</p>
            <button
              onClick={completeChallenge}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-xl"
            >
              Challenge pura thayu ✅
            </button>
          </div>
        )}

        {results.map((r) => (
          <div key={r.title} className="bg-white rounded-2xl shadow p-5 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-lg">{r.title}</h3>
              <span className="text-sm font-bold text-gray-600">{r.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className={"h-3 rounded-full " + barColor(r.score)}
                style={{ width: r.score + "%" }}
              ></div>
            </div>
            {r.missing.length === 0 ? (
              <p className="mt-3 text-green-600 font-medium">Tame aa mate ready cho! 🎉</p>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">Khute che (click karo shikhva mate):</p>
                <div className="flex flex-wrap gap-2">
                  {r.missing.map((m) => (
                    <button
                      key={m}
                      onClick={() => openGuide(m)}
                      className="bg-pink-100 hover:bg-pink-200 text-pink-700 text-sm px-3 py-1 rounded-full"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}

export default App