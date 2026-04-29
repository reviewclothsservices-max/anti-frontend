async function test() {
  try {
    const res = await fetch('http://127.0.0.1:3001/api/products');
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response (first 100 chars):', text.substring(0, 100));
    try {
      JSON.parse(text);
      console.log('Result: VALID JSON');
    } catch (e) {
      console.log('Result: INVALID JSON (HTML/Text)');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

test();
