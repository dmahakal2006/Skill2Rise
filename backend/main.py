from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OPPORTUNITIES = [
    {"title": "Data Entry Freelancer", "required": ["excel", "typing"]},
    {"title": "Social Media Assistant", "required": ["canva", "writing", "communication"]},
    {"title": "Online Tutor", "required": ["communication", "teaching"]},
    {"title": "Junior Web Developer", "required": ["html", "css", "javascript"]},
]

@app.get("/")
def home():
    return {"message": "Hello from Skill2Rise backend"}

@app.get("/match")
def match(skills: str = ""):
    user_skills = [s.strip().lower() for s in skills.split(",") if s.strip()]
    results = []
    for job in OPPORTUNITIES:
        missing = [s for s in job["required"] if s not in user_skills]
        have = len(job["required"]) - len(missing)
        score = int(have / len(job["required"]) * 100)
        results.append({"title": job["title"], "score": score, "missing": missing})
    results.sort(key=lambda r: r["score"], reverse=True)
    return results
SKILL_GUIDE = {
    "excel": {"learn": "Excel ma basic formulas (SUM, IF) ane table banavvu shikho.", "challenge": "Ek monthly kharch no Excel sheet banavo ane total kadho."},
    "typing": {"learn": "Roj 15 minute typing practice karo (10fastfingers.com).", "challenge": "Ek page 5 minute ma bhul vagar type karo."},
    "canva": {"learn": "Canva ma free account banavo ane ek template vapro.", "challenge": "Ek Instagram post design banavo."},
    "writing": {"learn": "Nana short posts lakhva no practice karo.", "challenge": "Kaik product par 100 shabdo no post lakho."},
    "communication": {"learn": "Saral bhasha ma vaat samjavvani practice karo.", "challenge": "Ek topic par 1 minute no voice note record karo."},
    "teaching": {"learn": "Koi ek topic vichaari ne step by step samjavvano plan banavo.", "challenge": "Kaik ek saral topic par 5 step ni nani guide lakho."},
    "html": {"learn": "HTML tags (h1, p, img, a) shikho.", "challenge": "Potano introduction page HTML ma banavo."},
    "css": {"learn": "CSS thi color, font ane layout badalvu shikho.", "challenge": "Potana HTML page ne sundar banavo."},
    "javascript": {"learn": "Variables, functions ane button click shikho.", "challenge": "Ek button banavo je click par message batave."},
}

@app.get("/skill-guide")
def skill_guide(name: str = ""):
    return SKILL_GUIDE.get(name.lower(), {"learn": "Aa skill mate guide jaldi aavse.", "challenge": "Challenge jaldi aavse."})