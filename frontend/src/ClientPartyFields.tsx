import { Box, MenuItem, TextField, Typography } from '@mui/material';

export default function ClientPartyFields({ value, caseTitle, onChange }: {
  value: Record<string, string>; caseTitle: string; onChange: (value: Record<string, string>) => void;
}) {
  const update = (field: string, next: string) => onChange({ ...value, [field]: next });
  const hasDetails = ['name', 'lawyer_name', 'contact_details', 'notes'].some(field => value[field]?.trim());
  return <>
    <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
      <Typography variant="h6">Case party details</Typography>
      <Typography variant="body2" color="text.secondary">Optional. Enter a party name to create a party linked to this client's new case.</Typography>
    </Box>
    <TextField label="Case" value={caseTitle} placeholder="Enter the case title above" InputProps={{ readOnly: true }} helperText="Linked automatically to the new case" fullWidth />
    <TextField label="Party name" value={value.name || ''} required={hasDetails} inputProps={{ maxLength: 200 }} onChange={e => update('name', e.target.value)} fullWidth />
    <TextField select label="Party type" value={value.party_type || 'opposing_party'} onChange={e => update('party_type', e.target.value)} fullWidth>
      {['plaintiff', 'defendant', 'petitioner', 'respondent', 'opposing_party', 'other'].map(type => <MenuItem key={type} value={type}>{type.replaceAll('_', ' ')}</MenuItem>)}
    </TextField>
    <TextField label="Opposing lawyer" value={value.lawyer_name || ''} inputProps={{ maxLength: 200 }} onChange={e => update('lawyer_name', e.target.value)} fullWidth />
    <TextField label="Contact details" value={value.contact_details || ''} onChange={e => update('contact_details', e.target.value)} fullWidth />
    <TextField label="Party notes" value={value.notes || ''} onChange={e => update('notes', e.target.value)} multiline minRows={2} fullWidth sx={{ gridColumn: '1 / -1' }} />
  </>;
}
