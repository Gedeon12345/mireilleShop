# Frontend – Mireille Shop (Phase 1)

```bash
cd frontend
npm install
cp .env.example .env   # VITE_USE_MOCK=true : données de démonstration
npm run dev            # http://localhost:5173
```

Passage à l'API réelle (phase 4) : `VITE_USE_MOCK=false`. Seuls les fichiers de `src/services/` appellent l'API ; les pages n'ont pas à changer.
