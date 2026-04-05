# Dr. Ramírez — Ready to Deploy

## Google Review Link (FOUND — replaces broken placeholder)

```
https://search.google.com/local/writereview?placeid=ChIJE54rz2ZxVo8fJUoCtE-BWw
```

**Business listing:** Dr. Luis Alberto Ramírez López, Neurocirujano
**Rating:** 5.0 (8 reviews)
**Address:** C. 26 199-Int. 417, Fraccionamiento Altabrisa, 97070 Mérida
**Phone:** +52 999 943 3334

This link goes into the post-visit follow-up email, replacing the broken `[LINK_RESENA_GOOGLE]` placeholder.

---

## Cal.com Setup Guide (for Luis — 20 min)

### Step 1: Sign up (5 min)
1. Go to https://cal.com/signup
2. Use Dr.'s Google account (drluisramirez72@gmail.com) OR create with office email
3. Pick the Teams plan ($12/mo) — or start with free tier to test
4. This automatically syncs with his Google Calendar

### Step 2: Create event type (5 min)
- Name: "Consulta de Neurocirugía"
- Duration: 30 min (adjust as needed)
- Locations: 
  - Hospital Faro del Mayab — Consultorio 711, Calle 24 280, Temozon Norte
  - Star Médica Mérida — C. 26 199-Int. 417, Altabrisa
- Let patient choose location when booking
- Booking questions: Name, Phone, Email, "Motivo de consulta" (text field)
- Buffer: 15 min before each appointment
- Availability: Set Dr.'s actual office hours

### Step 3: Set up email workflows (5 min)
In Cal.com → Workflows:

**Workflow 1: Booking Confirmation**
- Trigger: When booking is created
- Action: Send email to attendee
- Template below

**Workflow 2: Reminder 48h**
- Trigger: Before event starts (48 hours)
- Action: Send email to attendee
- Template below

**Workflow 3: Reminder 2h**
- Trigger: Before event starts (2 hours)
- Action: Send email to attendee
- Short reminder template

### Step 4: WhatsApp notification (Luis sets up later)
- Cal.com webhook → Zapier/n8n → WhatsApp message to Dr.'s phone
- This requires WhatsApp Business API or a Zapier WhatsApp integration
- Can do as Phase 2 after basic booking is working

### Step 5: Embed on website
Claude Code adds this to dr-luis-merida site:
```html
<!-- Cal.com embed -->
<cal-inline calLink="drramirezlopez/consulta-neurocirugia"></cal-inline>
<script type="module" src="https://app.cal.com/embed/embed.js"></script>
```

---

## Email Templates (Final — ready to paste into Cal.com)

### Template 1: Booking Confirmation

**Subject:** Confirmación de cita — Dr. Ramírez López, Neurocirugía

```
Estimado/a {attendee_name},

Su cita ha sido confirmada con el Dr. Luis Alberto Ramírez López.

📅 {event_date} a las {event_time}
📍 {location}

Le pedimos:
• Llegar 15 minutos antes de su cita
• Traer estudios previos si los tiene (radiografías, resonancias, tomografías)
• Traer una lista de los medicamentos que toma actualmente

Si necesita reagendar o cancelar:
{reschedule_link} | {cancel_link}

Nuestras sedes:
Faro del Mayab — +52 999 921 4962
Star Médica — +52 999 943 3334
Emergencias — +52 999 947 2495

Atentamente,
Equipo del Dr. Luis Alberto Ramírez López
Neurocirugía · Mérida, Yucatán
```

### Template 2: Reminder (48h before)

**Subject:** Recordatorio — Su cita es en 2 días

```
{attendee_name}, le recordamos que tiene cita con el Dr. Ramírez López.

📅 {event_date} a las {event_time}
📍 {location}

Recuerde llegar 15 minutos antes con sus estudios previos.

Si necesita reagendar: {reschedule_link}

Faro del Mayab — +52 999 921 4962
Star Médica — +52 999 943 3334

Equipo del Dr. Ramírez López
Neurocirugía · Mérida
```

### Template 3: Reminder (2h before)

**Subject:** Su cita es hoy — Dr. Ramírez López

```
{attendee_name}, su cita con el Dr. Ramírez López es hoy.

📅 {event_time}
📍 {location}

Recuerde llegar 15 minutos antes.

Equipo del Dr. Ramírez López
```

### Template 4: Post-visit Follow-up (send manually or via automation 24h after appointment)

**Subject:** Gracias por su visita — Dr. Ramírez López

```
Estimado/a {attendee_name},

Gracias por su visita al consultorio del Dr. Luis Alberto Ramírez López. Esperamos que la consulta haya sido de ayuda para usted.

Si tiene alguna duda sobre las indicaciones que recibió, no dude en contactarnos.

¿Cómo fue su experiencia?
Su opinión nos ayuda a que más pacientes nos conozcan. Si tiene un momento, nos encantaría que nos dejara una breve reseña:

⭐ Dejar reseña en Google:
https://search.google.com/local/writereview?placeid=ChIJE54rz2ZxVo8fJUoCtE-BWw

¿Necesita agendar seguimiento?
📅 Agendar cita: {booking_link}

Faro del Mayab — +52 999 921 4962
Star Médica — +52 999 943 3334
Emergencias — +52 999 947 2495

Atentamente,
Equipo del Dr. Luis Alberto Ramírez López
Neurocirugía · Mérida, Yucatán
```

---

## Immediate Fix: GHL Review Link

Even before migrating to Cal.com, fix the broken link in GHL RIGHT NOW:

1. Log into GHL → Automations or Email Templates
2. Find the post-visit follow-up email
3. Replace `[LINK_RESENA_GOOGLE]` with:
   `https://search.google.com/local/writereview?placeid=ChIJE54rz2ZxVo8fJUoCtE-BWw`
4. Save and test

This takes 2 minutes and stops broken emails from going to patients immediately.
