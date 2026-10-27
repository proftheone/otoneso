# otoneso.com

Statyczna strona otoneso.com (PL i EN), bez procesu budowania.

- `index.html` – strona główna EN, `index-pl.html` – strona główna PL
- Podstrony EN: `about.html`, `partners.html`, `ppwr-implementation.html`, `terms-of-service.html`, `privacy-policy.html`
- Podstrony PL: `o-nas.html`, `partnerzy.html`, `wdrozenie-ppwr.html`, `regulamin.html`, `polityka-prywatnosci.html`
- `site.css` – wspólne style podstron, `img/` – logo, zdjęcia i grafiki

Uwagi przed publikacją:
- Regulamin i polityka prywatności to streszczenia – trzeba je zastąpić oficjalnym tekstem.
- Formularze nie wysyłają danych; trzeba je podpiąć pod backend lub usługę formularzy.
- Przełącznik PL/EN prowadzi do odpowiednika danej strony w drugim języku.

## Render

Repo zawiera `render.yaml` (Blueprint dla statycznej strony). Wdrożenie jednym kliknięciem:
https://render.com/deploy?repo=https://github.com/proftheone/otoneso
