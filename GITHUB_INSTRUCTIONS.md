# Publicar en GitHub (repo público)

Pasos rápidos desde PowerShell para crear un repositorio público y subir los archivos:

```powershell
cd "c:\Users\adond\Documents\DESARROLLO DE SOFTWARE iesMB\3ro año\Arquitectura y diseño de interfaces\TP1"
git init
git add .
git commit -m "Initial commit: microservices example"

# Crear repo en GitHub (usa la web). Copia la URL del repo remoto por ejemplo:
# https://github.com/<tu-usuario>/microservices-example-tp1.git

git remote add origin https://github.com/<tu-usuario>/microservices-example-tp1.git
git branch -M main
git push -u origin main
```

Consejos:
- En GitHub selecciona "Public" para visibilidad pública.
- No subas secretos. Usa `.env` para variables sensibles y recuerda que `.env` está en `.gitignore`.
- Si quieres, puedo crear un `LICENSE` (MIT por defecto) y un `CODE_OF_CONDUCT.md`.
