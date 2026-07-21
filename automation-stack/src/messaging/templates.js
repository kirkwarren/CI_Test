function fmtWhen(clinic, iso) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: clinic.timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(iso));
}

export function confirmationSms(clinic, patient, appointment) {
  return `Hi ${patient.firstName}, you're booked at ${clinic.name} for ${fmtWhen(clinic, appointment.startIso)}. Reply STOP to opt out of texts.`;
}

export function reminderSms(clinic, patient, appointment) {
  return `Hi ${patient.firstName}, reminder: your session at ${clinic.name} is ${fmtWhen(clinic, appointment.startIso)}. Need to reschedule? ${clinic.bookingUrl}`;
}

export function reviewRequestSms(clinic, patient) {
  return `Hi ${patient.firstName}, thanks for coming in to ${clinic.name}! If you have a minute, a Google review helps our small practice a lot: ${clinic.googleReviewUrl}`;
}

export function noShowNudgeSms(clinic, patient) {
  return `Hi ${patient.firstName}, we missed you at ${clinic.name} today. Life happens! Grab a new time that works for you: ${clinic.bookingUrl}`;
}

export function planOfCareNudgeSms(clinic, patient) {
  return `Hi ${patient.firstName}, it's ${clinic.name}. Staying consistent is the biggest driver of results — want to get your next session on the calendar? ${clinic.bookingUrl}`;
}

export function packageExpiringSms(clinic, patient, pkg, remaining) {
  return `Hi ${patient.firstName}, heads up from ${clinic.name}: you have ${remaining} session${remaining === 1 ? "" : "s"} left on your ${pkg.name} and it expires soon. Book here: ${clinic.bookingUrl}`;
}

export function dormantReengagementSms(clinic, patient) {
  return `Hi ${patient.firstName}, it's been a while since we've seen you at ${clinic.name}. If aches are creeping back, a tune-up session can help: ${clinic.bookingUrl}`;
}

export function ownerDigestSms(clinic, digest) {
  return (
    `${clinic.name} daily digest: ` +
    `${digest.completed} completed, ${digest.noShows} no-shows, ${digest.upcomingTomorrow} booked tomorrow. ` +
    `Collected $${digest.paymentsTotal.toFixed(2)}. ` +
    `${digest.messagesSent} texts sent, ${digest.openFollowups} follow-ups open.`
  );
}
