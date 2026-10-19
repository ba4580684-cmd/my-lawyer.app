// City options for client addresses, grouped by province or territory.
export const citiesByProvince: Record<string, string[]> = {
  Punjab: ['Attock', 'Bahawalnagar', 'Bahawalpur', 'Bhakkar', 'Chakwal', 'Chiniot', 'Dera Ghazi Khan', 'Faisalabad', 'Gujranwala', 'Gujrat', 'Hafizabad', 'Jhang', 'Jhelum', 'Kasur', 'Khanewal', 'Khushab', 'Lahore', 'Layyah', 'Lodhran', 'Mandi Bahauddin', 'Mianwali', 'Multan', 'Muzaffargarh', 'Nankana Sahib', 'Narowal', 'Okara', 'Pakpattan', 'Rahim Yar Khan', 'Rajanpur', 'Rawalpindi', 'Sahiwal', 'Sargodha', 'Sheikhupura', 'Sialkot', 'Toba Tek Singh', 'Vehari'],
  Sindh: ['Badin', 'Dadu', 'Ghotki', 'Hala', 'Hyderabad', 'Jacobabad', 'Jamshoro', 'Karachi', 'Kashmore', 'Khairpur', 'Larkana', 'Matiari', 'Mirpur Khas', 'Mithi', 'Moro', 'Naushahro Feroze', 'Nawabshah', 'Sanghar', 'Sehwan', 'Shikarpur', 'Sukkur', 'Tando Adam', 'Tando Allahyar', 'Tando Muhammad Khan', 'Thatta', 'Umerkot'],
  'Khyber Pakhtunkhwa': ['Abbottabad', 'Bannu', 'Batkhela', 'Charsadda', 'Chitral', 'Dera Ismail Khan', 'Hangu', 'Haripur', 'Karak', 'Kohat', 'Lakki Marwat', 'Mansehra', 'Mardan', 'Mingora', 'Nowshera', 'Peshawar', 'Swabi', 'Timergara', 'Topi'],
  Balochistan: ['Awaran', 'Barkhan', 'Chaman', 'Dera Allah Yar', 'Dera Bugti', 'Dera Murad Jamali', 'Gwadar', 'Hub', 'Kalat', 'Kharan', 'Khuzdar', 'Kohlu', 'Loralai', 'Mastung', 'Nushki', 'Panjgur', 'Pishin', 'Quetta', 'Sibi', 'Turbat', 'Uthal', 'Zhob', 'Ziarat'],
  'Islamabad Capital Territory': ['Islamabad'],
  'Azad Jammu and Kashmir': ['Athmuqam', 'Bagh', 'Bhimber', 'Hattian Bala', 'Haveli', 'Kotli', 'Mirpur', 'Muzaffarabad', 'Pallandri', 'Rawalakot'],
  'Gilgit-Baltistan': ['Aliabad', 'Astore', 'Chilas', 'Dambudas', 'Gahkuch', 'Gilgit', 'Karimabad', 'Khaplu', 'Shigar', 'Skardu', 'Tolti'],
};

// Keep previously saved addresses visible when editing older records.
export function locationOptions(options: string[], currentValue: string): string[] {
  return currentValue && !options.includes(currentValue) ? [currentValue, ...options] : options;
}
