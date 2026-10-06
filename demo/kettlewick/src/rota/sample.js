// The Monday the app opens on until an owner pastes their own day: Jo is poorly, her 9 o'clock in
// Church End is uncovered. All fictional; the tests use it too. A visit holds what the import keeps
// (PRIVACY.md): the client's first name, the day, the time, the area. Never an address or a note.
export const carers = [
  { id: 'priya', firstName: 'Priya', phone: '07700 900101', area: 'Church End', days: ['mon', 'tue', 'wed'] },
  { id: 'sam', firstName: 'Sam', phone: '07700 900102', area: 'Church End', days: ['mon', 'thu'] },
  { id: 'dee', firstName: 'Dee', phone: '07700 900103', area: 'Church End', days: ['mon', 'fri'] },
  { id: 'tomasz', firstName: 'Tomasz', phone: '07700 900104', area: 'Wellbridge town centre', days: ['mon'] },
  { id: 'ruth', firstName: 'Ruth', phone: '07700 900105', area: 'Wellbridge town centre', days: ['mon', 'wed'] },
  { id: 'bo', firstName: 'Bo', phone: '07700 900106', area: 'Wellbridge town centre', days: ['tue'] },
  { id: 'jo', firstName: 'Jo', phone: '07700 900107', area: 'Church End', days: ['mon', 'tue'] },
];

export const uncovered = {
  id: 'v-0900', day: '2026-09-21', start: '09:00', end: '09:45', area: 'Church End',
  client: 'Maureen', carerId: null, offCarerId: 'jo',
};

export const rota = {
  carers,
  visits: [
    uncovered,
    { id: 'v-0830', day: '2026-09-21', start: '08:30', end: '09:15', area: 'Wellbridge town centre', client: 'Arthur', carerId: 'ruth', offCarerId: null },
    { id: 'v-1100', day: '2026-09-21', start: '11:00', end: '11:30', area: 'Church End', client: 'Nell', carerId: 'sam', offCarerId: null },
  ],
};
