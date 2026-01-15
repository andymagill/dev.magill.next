---
title: Row Level Security in Serverless PostgreSQL for HIPAA Compliance
description: Row Level Security in PostgreSQL isn’t just a neat trick-it’s a practical, scalable way to keep your pharma web app HIPAA-compliant without losing your mind
image: /images/blog/marcos-mayer-locks.jpg
tags: Serverless, HIPAA, PostgreSQL
created: 1744729263
lastUpdated: 1768487848
---

It's time to revisit everyone's two favorite topics, Row Level Security (RLS) and HIPAA compliance. I'm here to give the people what they want, so here is my take on how to create a safe and orderly place for your legally-protected patient data to live.

If you’re building a patient-focused web app and you’re not thinking about HIPAA compliance, you haven't seen the [penalty structure for violations](https://www.ama-assn.org/practice-management/hipaa/hipaa-violations-enforcement#:~:text=HIPAA%20violation:%20Unknowing,imprisonment%20up%20to%201%20year.). For the rest of us, protecting patient data isn’t just a checkbox—it’s a survival skill.

### What the Heck is Row Level Security, and Why Should You Care?

Row Level Security (RLS) is PostgreSQL’s way of saying, “Welcome, but stay in your assigned space.” Your users become kinda like guests in a hotel, only if door locks were as cool as SQL policies. RLS lets you centralize your access logic, so you can focus on giving your guests a great experience.

And yeah, it’s a HIPAA win: RLS helps you enforce the “minimum necessary” access rule, so you’re not handing out master keys when someone just needs access to one room.

### Shared Policies Using Many-to-Many Relationships

Row Level Security in PostgreSQL is powerful enough to handle even complex relationships like many-to-many mappings between clinicians and patients. By leveraging join tables and smart policies, you can ensure HIPAA compliance while maintaining a scalable and secure database structure. We'll have 3 tables; `patients`, `clinicians`, and `clinicians_patients`.

## 1. Create Policies for Clinicians

Let's say there's a many-to-many relationship between clinicians and patients managed through a `clinicians_patients` join table. We want clinicians to only see their own patients, but not others. Here's how we can get there:

```sql
CREATE POLICY clinician_patient_access ON patients
  FOR SELECT, UPDATE
  USING (EXISTS (
    SELECT 1
    FROM clinicians_patients
    WHERE clinicians_patients.patient_id = patients.id
      AND clinicians_patients.clinician_id = current_setting('app.current_user')::int
  ));

CREATE POLICY clinician_patient_delete ON patients
  FOR DELETE
  USING (EXISTS (
    SELECT 1
    FROM clinicians_patients
    WHERE clinicians_patients.patient_id = patients.id
      AND clinicians_patients.clinician_id = current_setting('app.current_user')::int
  ));
```

This policy works by checking if the `clinician_id` in the `clinicians_patients` join table matches the current user's session variable. To make this work, your application must set the `app.current_user` session variable to the clinician's ID upon authentication (more on that in a second).

## 2. Enable RLS on Your Tables

We still need to tell PostgreSQL to actually care about row-level access. By default, it's blissfully ignorant. Enable RLS on all three tables:

```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinicians_patients ENABLE ROW LEVEL SECURITY;
```

### One RLS Policy to Rule Them All

By default, superusers and table owners can bypass RLS, which can be risky in serverless setups where connections are shared. To lock down access completely, force RLS on sensitive tables:

```sql
ALTER TABLE patients FORCE ROW LEVEL SECURITY;
ALTER TABLE clinicians FORCE ROW LEVEL SECURITY;
ALTER TABLE clinicians_patients FORCE ROW LEVEL SECURITY;
```

This ensures all access follows your RLS policies, even for privileged users. In serverless environments, this step is crucial to protect sensitive data and maintain compliance. Now, not even the table owner can bypass your policies.

## 3. Serverless Gotchas

Serverless PostgreSQL is stateless, so we can’t rely on sticky sessions or nerd magic. We'll need to establish [PostgreSQL session variables](https://www.postgresql.org/docs/current/runtime-config-client.html) at the start of each connection. Our app’s authentication layer should handle this — _don’t trust anyone!_. But since we're cool, here's the deets:

### Set the PostgreSQL Session Variable

In your app, set the user session after successfully establishing a connection:

```javascript
// Node.js example with pg library
const { Client } = require('pg');

async function setSessionVariable(userId) {
	const client = new Client({ connectionString: process.env.DATABASE_URL });

	// Set the session variable for the current user
	await client.query('SET SESSION "app.current_user" = $1', [userId]);
}
```

### Is All That Really Necessary?

Setting session variables at the start of each connection makes sure that user-specific context is explicitly defined. This context is critical for enforcing RLS policies, which depend on session variables to determine which rows a user can access. Without session variables, we're missing the necessary context to apply our shiny new polices and access controls.

## Conclusion

Row Level Security in PostgreSQL isn't just a neat trick—it's a practical, scalable way to remain HIPAA-compliant without losing your mind (or your patients' data). In a serverless world, it's even more important to simplify access logic, to prevent unforeseen challenges from becoming critical failures.

With some thoughtful RLS policies, we can let PostgreSQL do the heavy lifting, while we sit back and admire what we accomplished. And if someone asks why you’re so calm about HIPAA audits, just wink and say, _“It’s all in the rows, my friend.”_

**Further Reading:**

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [HIPAA Security Rule Summary (HHS.gov)](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
- Serverless PostgreSQL Providers: [Neon](https://neon.tech/), [Supabase](https://supabase.com/), [AWS Aurora](https://aws.amazon.com/rds/aurora/serverless/)
