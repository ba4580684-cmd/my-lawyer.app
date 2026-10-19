import { Autocomplete, TextField } from '@mui/material';
import { courtNames, districts } from './caseOptions';

export default function CaseSearchField({ field, value, onChange }: {
  field: 'district' | 'court_name'; value: string; onChange: (value: string) => void;
}) {
  const label = field === 'district' ? 'District' : 'Court name';
  return <Autocomplete
    freeSolo openOnFocus autoHighlight fullWidth
    options={field === 'district' ? districts : courtNames}
    value={value || null} inputValue={value}
    onInputChange={(_event, next) => onChange(next)}
    onChange={(_event, next) => onChange(next || '')}
    renderInput={params => <TextField {...params} label={label} placeholder={`Search ${label.toLowerCase()}`} />}
  />;
}
