async function test() {
  try {
    const res = await fetch('http://127.0.0.1:3001/api/admin/dashboard-stats');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
