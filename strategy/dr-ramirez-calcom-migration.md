# Dr. Ramírez — Migrate from GHL to Cal.com

## Why

GHL costs $97/mo and the only thing we use is calendar booking + reminders. The phone notifications (LeadConnector app) are broken — Dr. can't hear when someone books. Cal.com does everything we need for $12/mo or free self-hosted, with native WhatsApp notifications.

## What We Need

1. Patients book online (embedded widget on dr-luis-merida website)
2. Dr. gets instant WhatsApp notification with sound when someone books
3. Patient gets email confirmation
4. Patient gets reminder 2 days before + day of
5. Post-visit: thank you email + Google review request (with WORKING link)
6. Google Calendar sync (prevents double booking)
7. Rescheduling/cancellation links for patients

## Architecture

```
Patient visits dr-luis-merida website
  → Clicks "Agendar Cita"
  → Cal.com embed shows available slots (synced with Google Calendar)
  → Patient selects time, enters name + phone + email
  → Cal.com creates booking
    → Webhook fires → n8n/Zapier → WhatsApp message to Dr.'s phone
    → Email confirmation to patient
    → Reminder workflow: 2 days before + 2 hours before
    → Post-visit (triggered manually or by calendar event end):
      → Thank you email + Google review link
```

## Option A: Hosted Cal.com ($12/mo)

- Sign up at cal.com
- Create event type: "Consulta Neurocirugía — Dr. Ramírez López"
- Locations: Hospital Faro del Mayab, Star Médica
- Duration: 30 min (or whatever Dr. prefers)
- Connect Google Calendar for availability sync
- Set up workflows:
  - On booking: email confirmation to patient
  - 48h before: email reminder
  - 2h before: email reminder
  - On booking: webhook → WhatsApp to Dr.
- Embed on website: `<cal-inline calLink="drramirezlopez/consulta"></cal-inline>`

## Option B: Self-hosted on Mac Mini (free)

- Docker: `docker run -d -p 3001:3000 calcom/cal.com`
- Expose via Tailscale or Cloudflare tunnel
- Same configuration as Option A but no monthly cost
- More setup, more maintenance

**Recommendation:** Start with hosted ($12/mo). Migration takes 1-2 hours. Self-host later if needed.

## WhatsApp Notification Setup

Cal.com has built-in workflow automation. For WhatsApp specifically:

**Option 1: Cal.com → Zapier → WhatsApp Business API**
- Cal.com trigger: "Booking Created"
- Zapier action: Send WhatsApp message
- Template: "Nueva cita: {patient_name} — {date} {time} — {location}"
- Sent to Dr.'s WhatsApp number

**Option 2: Cal.com → n8n (self-hosted) → WhatsApp Cloud API**
- Same flow but using n8n on Mac Mini (free, no Zapier cost)
- n8n webhook catches Cal.com booking event
- Formats message and sends via WhatsApp Cloud API

**Option 3: Cal.com → webhook → simple script on Mac Mini**
- Simplest: Cal.com fires webhook to a small Express endpoint on Mac Mini
- Script sends WhatsApp via Twilio or WhatsApp Cloud API
- No third-party automation tool needed

## Google Review Link

The current GHL email has a broken placeholder: `[LINK_RESENA_GOOGLE]`

**Get the real link:**
1. Go to Google Maps → search "Dr. Luis Alberto Ramírez López Neurocirugía Mérida"
2. Click on the business listing
3. Click "Write a review" → copy that URL
4. Or construct: `https://search.google.com/local/writereview?placeid=PLACE_ID`

This link goes in the post-visit follow-up email template.

## Email Templates to Migrate

### 1. Booking Confirmation
```
Asunto: Confirmación de cita — Dr. Ramírez López

Estimado/a {name},

Su cita ha sido confirmada con el Dr. Luis Alberto Ramírez López.

📅 {date} {time}
📍 {location}

Le pedimos:
• Llegar 15 minutos antes
• Traer estudios previos (radiografías, resonancias, tomografías)
• Traer lista de medicamentos actuales

Si necesita reagendar: {reschedule_link}
Si necesita cancelar: {cancel_link}

Faro del Mayab: +52 999 921 4962
Star Médica: +52 999 943 3334
Emergencias: +52 999 947 2495

Atentamente,
Equipo del Dr. Ramírez López
Neurocirugía · Mérida
```

### 2. Reminder (2 days before)
```
Asunto: Recordatorio — Su cita es en 2 días

{name}, le recordamos que tiene cita con el Dr. Ramírez López.

📅 {date} {time}
📍 {location}

Recuerde llegar 15 minutos antes con sus estudios previos.

Reagendar: {reschedule_link}

Faro del Mayab: +52 999 921 4962
Star Médica: +52 999 943 3334
```

### 3. Post-visit Follow-up
```
Asunto: Gracias por su visita — Dr. Ramírez López

Estimado/a {name},

Gracias por su visita al consultorio del Dr. Ramírez López.

Si tiene alguna duda sobre las indicaciones que recibió, no dude en contactarnos.

¿Cómo fue su experiencia?
Su opinión nos ayuda a que más pacientes nos conozcan.

⭐ Dejar reseña en Google: {GOOGLE_REVIEW_LINK}

¿Necesita agendar seguimiento?
📅 Agendar cita: {booking_link}

Faro del Mayab: +52 999 921 4962
Star Médica: +52 999 943 3334
Emergencias: +52 999 947 2495

Atentamente,
Equipo del Dr. Ramírez López
Neurocirugía · Mérida, Yucatán
```

## Steps

1. [ ] Sign up for Cal.com (hosted, $12/mo)
2. [ ] Create event type for consulta
3. [ ] Connect Dr.'s Google Calendar
4. [ ] Set up email confirmation + reminder workflows
5. [ ] Get real Google Review link and add to post-visit template
6. [ ] Set up WhatsApp notification (Zapier or webhook)
7. [ ] Embed Cal.com widget on dr-luis-merida website
8. [ ] Test full flow: book → confirm → remind → notify Dr.
9. [ ] Cancel GHL ($97/mo saved)

## Timeline

This is a 1-day task for Claude Code (website embed + webhook setup) + 30 min of Luis's time (Cal.com signup, Google Calendar connect, test WhatsApp).
