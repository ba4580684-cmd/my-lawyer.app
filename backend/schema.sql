CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL,
 email VARCHAR(255) NOT NULL UNIQUE, password_hash TEXT NOT NULL,
 preferred_language VARCHAR(5) NOT NULL DEFAULT 'en', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS clients (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 client_number VARCHAR(40) NOT NULL, full_name VARCHAR(200) NOT NULL, phone VARCHAR(30), email VARCHAR(255),
 cnic VARCHAR(30), address TEXT, city VARCHAR(100), province VARCHAR(100), client_type VARCHAR(30) NOT NULL DEFAULT 'individual',
 notes TEXT, status VARCHAR(20) NOT NULL DEFAULT 'active', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(owner_id, client_number)
);
CREATE TABLE IF NOT EXISTS case_types (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL UNIQUE, name_ur VARCHAR(100), is_active BOOLEAN NOT NULL DEFAULT true);
INSERT INTO case_types(name,name_ur) VALUES ('Civil','دیوانی'),('Criminal','فوجداری'),('Family','خاندانی'),('Property','جائیداد'),('Constitutional','آئینی'),('Corporate','کارپوریٹ'),('Other','دیگر') ON CONFLICT(name) DO NOTHING;
CREATE TABLE IF NOT EXISTS courts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID REFERENCES users(id) ON DELETE CASCADE, name VARCHAR(200) NOT NULL, district VARCHAR(100), province VARCHAR(100), jurisdiction VARCHAR(100), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS cases (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 client_id UUID NOT NULL REFERENCES clients(id), internal_case_number VARCHAR(50) NOT NULL, title VARCHAR(255) NOT NULL,
 court_case_number VARCHAR(100), case_type VARCHAR(100) NOT NULL DEFAULT 'Civil', court_name VARCHAR(200), district VARCHAR(100), province VARCHAR(100), judge_name VARCHAR(200),
 filing_date DATE, status VARCHAR(30) NOT NULL DEFAULT 'active', description TEXT, outcome TEXT, disposed_at DATE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(owner_id,internal_case_number)
);
CREATE TABLE IF NOT EXISTS case_parties (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE, name VARCHAR(200) NOT NULL, party_type VARCHAR(40) NOT NULL DEFAULT 'opposing_party', lawyer_name VARCHAR(200), contact_details TEXT, notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS hearings (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
 scheduled_at TIMESTAMPTZ NOT NULL, court_name VARCHAR(200), hearing_type VARCHAR(50) NOT NULL DEFAULT 'hearing', status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
 proceedings_notes TEXT, next_steps TEXT, reminder_at TIMESTAMPTZ, completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tasks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
 title VARCHAR(255) NOT NULL, description TEXT, priority VARCHAR(20) NOT NULL DEFAULT 'medium', due_at TIMESTAMPTZ, status VARCHAR(20) NOT NULL DEFAULT 'pending', completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS case_notes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE, note_type VARCHAR(30) NOT NULL DEFAULT 'general', body TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS case_documents (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
 title VARCHAR(255) NOT NULL, document_type VARCHAR(50) NOT NULL DEFAULT 'other', storage_key TEXT NOT NULL, original_filename TEXT NOT NULL, mime_type VARCHAR(100), file_size_bytes BIGINT, uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(), deleted_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS fee_agreements (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE, agreed_amount NUMERIC(14,2) NOT NULL CHECK(agreed_amount >= 0), currency CHAR(3) NOT NULL DEFAULT 'PKR', description TEXT, agreed_at DATE NOT NULL DEFAULT CURRENT_DATE, status VARCHAR(20) NOT NULL DEFAULT 'active', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE, invoice_number VARCHAR(50) NOT NULL, total_amount NUMERIC(14,2) NOT NULL CHECK(total_amount >= 0), currency CHAR(3) NOT NULL DEFAULT 'PKR', issued_at DATE NOT NULL DEFAULT CURRENT_DATE, due_at DATE, status VARCHAR(20) NOT NULL DEFAULT 'issued', description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(owner_id,invoice_number));
CREATE TABLE IF NOT EXISTS payments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, client_id UUID NOT NULL REFERENCES clients(id), case_id UUID REFERENCES cases(id) ON DELETE SET NULL, amount NUMERIC(14,2) NOT NULL CHECK(amount > 0), currency CHAR(3) NOT NULL DEFAULT 'PKR', method VARCHAR(30) NOT NULL DEFAULT 'cash', received_at TIMESTAMPTZ NOT NULL DEFAULT now(), reference VARCHAR(100), status VARCHAR(20) NOT NULL DEFAULT 'received', notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS payment_allocations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, payment_id UUID NOT NULL REFERENCES payments(id), invoice_id UUID NOT NULL REFERENCES invoices(id), allocated_amount NUMERIC(14,2) NOT NULL CHECK(allocated_amount > 0), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(payment_id,invoice_id));
CREATE TABLE IF NOT EXISTS case_expenses (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE, description TEXT NOT NULL, amount NUMERIC(14,2) NOT NULL CHECK(amount >= 0), expense_date DATE NOT NULL DEFAULT CURRENT_DATE, reimbursable BOOLEAN NOT NULL DEFAULT true, reimbursement_status VARCHAR(20) NOT NULL DEFAULT 'unpaid', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS audit_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, actor_id UUID REFERENCES users(id), action VARCHAR(100) NOT NULL, entity_type VARCHAR(80) NOT NULL, entity_id UUID, metadata JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_clients_owner_name ON clients(owner_id,full_name);
CREATE INDEX IF NOT EXISTS idx_cases_owner_status ON cases(owner_id,status);
CREATE INDEX IF NOT EXISTS idx_hearings_owner_date ON hearings(owner_id,scheduled_at);
CREATE INDEX IF NOT EXISTS idx_tasks_owner_due ON tasks(owner_id,due_at);
CREATE INDEX IF NOT EXISTS idx_payments_owner_date ON payments(owner_id,received_at);
