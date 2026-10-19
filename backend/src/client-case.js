import { randomUUID } from 'node:crypto';

export async function createClientWithCase(pool, ownerId, client, caseDetails, partyDetails = {}) {
  const hasParty = ['name', 'lawyer_name', 'contact_details', 'notes'].some(field => partyDetails[field] != null && partyDetails[field] !== '');
  if (hasParty && (typeof partyDetails.name !== 'string' || !partyDetails.name.trim())) {
    const error = new Error('Party name is required when entering case party details.');
    error.status = 400;
    throw error;
  }
  const limits = [
    [client, { full_name: 200, phone: 30, email: 255, cnic: 30, city: 100, province: 100, client_type: 30 }],
    [caseDetails, { title: 255, court_case_number: 100, case_type: 100, court_name: 200, district: 100, province: 100, judge_name: 200, status: 30 }],
    [partyDetails, { name: 200, party_type: 40, lawyer_name: 200 }],
  ];
  for (const [input, fields] of limits) {
    for (const [field, max] of Object.entries(fields)) {
      if (input[field] != null && (typeof input[field] !== 'string' || [...input[field]].length > max)) {
        const label = { cnic: 'CNIC', title: 'Case title' }[field] || field.replaceAll('_', ' ');
        const error = new Error(`${label} must be text with no more than ${max} characters.`);
        error.status = 400;
        throw error;
      }
    }
  }
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    async function insert(table, input, allowed, defaults) {
      const data = { ...defaults };
      for (const field of allowed) if (input[field] !== undefined) data[field] = input[field];
      if (table === 'cases' && !data.filing_date) data.filing_date = null;
      const columns = Object.keys(data);
      const result = await db.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${columns.map((_, i) => `$${i + 1}`).join(',')}) RETURNING *`, Object.values(data));
      return result.rows[0];
    }
    const item = await insert('clients', client,
      ['full_name', 'phone', 'email', 'cnic', 'address', 'city', 'province', 'client_type', 'notes'],
      { owner_id: ownerId, client_number: `CL-${randomUUID()}`, client_type: 'individual' });
    const linkedCase = await insert('cases', caseDetails,
      ['title', 'court_case_number', 'case_type', 'court_name', 'district', 'province', 'judge_name', 'filing_date', 'status', 'description'],
      { owner_id: ownerId, client_id: item.id, internal_case_number: `CASE-${randomUUID()}`, case_type: 'Civil', status: 'active' });
    const party = hasParty ? await insert('case_parties', partyDetails,
      ['name', 'party_type', 'lawyer_name', 'contact_details', 'notes'],
      { owner_id: ownerId, case_id: linkedCase.id, party_type: 'opposing_party' }) : null;
    const created = [['clients', item.id], ['cases', linkedCase.id]];
    if (party) created.push(['case_parties', party.id]);
    for (const [table, id] of created) {
      await db.query('INSERT INTO audit_logs(owner_id,actor_id,action,entity_type,entity_id,metadata) VALUES($1,$1,$2,$3,$4,$5)', [ownerId, 'create', table, id, '{}']);
    }
    await db.query('COMMIT');
    return { item, case: linkedCase, party };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}
