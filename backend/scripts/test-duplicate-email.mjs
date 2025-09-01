import fetch from 'node-fetch';

const BASE = 'http://localhost:3000';

async function req(path, opts = {}){
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text) } catch { body = text }
  return { status: res.status, body, headers: res.headers.raw() };
}

async function main(){
  console.log('Starting duplicate-email test against', BASE);
  // Create user A
  const emailA = `userA_${Date.now()}@example.com`;
  const passA = 'Password1';
  console.log('Creating user A', emailA);
  let r = await req('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'User A', email: emailA, password: passA })
  });
  console.log('Signup A ->', r.status, r.body);
  if (r.status >= 400) return process.exit(2);

  // Create user B
  const emailB = `userB_${Date.now()}@example.com`;
  const passB = 'Password1';
  console.log('Creating user B', emailB);
  r = await req('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'User B', email: emailB, password: passB })
  });
  console.log('Signup B ->', r.status, r.body);
  if (r.status >= 400) return process.exit(3);

  // Sign in as B
  console.log('Signing in as B');
  r = await req('/api/auth/signin', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailB, password: passB })
  });
  console.log('Signin B ->', r.status, r.body);
  if (r.status !== 200) return process.exit(4);
  const tokenB = r.body.token;

  // Attempt to update B's email to A's email
  console.log(`Updating user B email to ${emailA} (should get 409)`);
  r = await req('/api/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
    body: JSON.stringify({ email: emailA })
  });
  console.log('Update attempt ->', r.status, r.body);

  if (r.status === 409) {
    console.log('Test PASSED: received 409 for duplicate email');
    process.exit(0);
  } else {
    console.error('Test FAILED: expected 409 but got', r.status);
    process.exit(5);
  }
}

main().catch(err => { console.error(err); process.exit(10) });
