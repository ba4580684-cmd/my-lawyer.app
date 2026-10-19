import { Autocomplete, Box, MenuItem, TextField, Typography } from '@mui/material';
import { citiesByProvince, locationOptions } from './locations';
import CaseSearchField from './CaseSearchField';

export default function ClientCaseFields({ value, onChange }: {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) {
  const update = (field: string, next: string) => onChange({ ...value, [field]: next });
  return <>
    <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
      <Typography variant="h6">Case details</Typography>
      <Typography variant="body2" color="text.secondary">This case will be linked to the new client automatically.</Typography>
    </Box>
    <TextField label="Case title" required value={value.title || ''} onChange={e => update('title', e.target.value)} fullWidth />
    <TextField label="Court case number" value={value.court_case_number || ''} onChange={e => update('court_case_number', e.target.value)} fullWidth />
    <TextField select label="Case type" value={value.case_type || 'Civil'} onChange={e => update('case_type', e.target.value)} fullWidth>
      {['Civil', 'Criminal', 'Family', 'Property', 'Constitutional', 'Corporate', 'Other'].map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
    </TextField>
    <CaseSearchField field="court_name" value={value.court_name || ''} onChange={next => update('court_name', next)} />
    <CaseSearchField field="district" value={value.district || ''} onChange={next => update('district', next)} />
    <Autocomplete options={locationOptions(Object.keys(citiesByProvince), value.province || '')} value={value.province || null} openOnFocus autoHighlight onChange={(_, next) => update('province', next || '')} renderInput={params => <TextField {...params} label="Case province" placeholder="Search province" />} />
    <TextField label="Judge name" value={value.judge_name || ''} onChange={e => update('judge_name', e.target.value)} fullWidth />
    <TextField label="Filing date" type="date" value={value.filing_date || ''} onChange={e => update('filing_date', e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
    <TextField select label="Status" value={value.status || 'active'} onChange={e => update('status', e.target.value)} fullWidth>
      {['active', 'pending', 'disposed', 'closed'].map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
    </TextField>
    <TextField label="Description" value={value.description || ''} onChange={e => update('description', e.target.value)} multiline minRows={2} fullWidth sx={{ gridColumn: '1 / -1' }} />
  </>;
}
