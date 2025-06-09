// populateUsersAndOpens.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001',     
  headers: { 'Content-Type': 'application/json' }
});

async function main() {
  // 1. Логін девелопера
  const devCreds = { email: 'yaromirkr@gmail.com', password: 'yaromirkr@gmail.com' };
  const loginRes = await API.post('/users/login', devCreds);
  API.defaults.headers['Authorization'] = 'Bearer ' + loginRes.data.accessToken;

  // 2. Створимо кількох мешканців
  const usersToCreate = [
    { firstName: 'Alice',   lastName: 'Smith',   email: 'alice.smith@example.com' },
    { firstName: 'Bob',     lastName: 'Johnson', email: 'bob.johnson@example.com' },
    { firstName: 'Carol',   lastName: 'Williams',email: 'carol.williams@example.com' },
    { firstName: 'David',   lastName: 'Brown',   email: 'david.brown@example.com' },
    { firstName: 'Eve',     lastName: 'Davis',   email: 'eve.davis@example.com' }
  ];

  for (const u of usersToCreate) {
    const res = await API.post('/users/user', u);
    console.log(`Created user ${u.email} (id=${res.data.id})`);
  }

  // 3. Отримаємо всі двері
  const doorsRes = await API.get('/doors');
  const allDoors = doorsRes.data; // масив з полями { id, device_id, ... }

  // 4. Ще раз симулюємо відкриття дверей
  for (const door of allDoors) {
    // випадкова кількість відкриттів від 20 до 100
    const count = Math.floor(Math.random() * 81) + 20;
    for (let i = 0; i < count; i++) {
      await API.post(`/doors/${door.device_id}/open`);
    }
    console.log(`Door ${door.device_id}: ${count} additional opens`);
  }

  console.log('=== Додаткове наповнення користувачами та логами завершено ===');
}

main().catch(err => {
  console.error('Error in populateUsersAndOpens script:', err.response?.data || err);
  process.exit(1);
});
