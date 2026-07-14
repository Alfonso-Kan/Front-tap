// Al desplegar el frontend (Vercel/Netlify) por separado del backend
// (Railway/Render), NO comparten dominio, así que apiUrl debe apuntar a la
// URL pública completa del backend. Reemplaza el valor antes de compilar:
//   ng build --configuration production
export const environment = {
  production: true,
  apiUrl: 'https://TU-BACKEND.up.railway.app/api',
};
