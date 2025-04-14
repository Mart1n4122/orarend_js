document.addEventListener('DOMContentLoaded', async () => {
  const timetable = document.getElementById('timetable');
  const addForm = document.getElementById('add-form');
  const editForm = document.getElementById('edit-form');
  const editContainer = document.getElementById('edit-container');
  const cancelEditButton = document.getElementById('cancel-edit');
  const daysOfWeek = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];
  let timetableData = [];

  async function fetchTimetable() {
    try {
      const response = await fetch('http://localhost:3000/classes');
      if (response.ok) {
        const data = await response.json();
        console.log("Timetable data:", data);  // Ellenőrizd, hogy milyen adatokat kapsz
        timetableData = data;  // Globálisan tárold az adatokat
        renderTable(timetableData);  // Rendereld a táblázatot
      } else {
        console.error('Failed to fetch timetable:', await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
    }
  }
  

  function renderTable(timetableData) {
    if (!timetableData || timetableData.length === 0) {
      console.error("Nincs elérhető óraadat!");
      return;
    }
  
    const maxClassNumber = 12;
  
    timetable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Óra</th>
            ${daysOfWeek.map(day => `<th>${day}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: maxClassNumber }, (_, i) => renderRow(i + 1, timetableData)).join('')}
        </tbody>
      </table>`;
  
    attachEventListeners();
  }
  

  function renderRow(classNumber, timetableData) {
    return `
      <tr>
        <td>${classNumber}. Óra</td>
        ${daysOfWeek.map(day => renderCell(day, classNumber, timetableData)).join('')}
      </tr>`;
  }

  function renderCell(day, classNumber, timetableData) {
    const classInfo = timetableData.find(c => c.day === day && c.classNumber === classNumber);
    return `
      <td>
        ${classInfo ? `
          <div class="class-info">
            <div class="class-name">${classInfo.className}</div>
            <button class="edit" data-id="${classInfo.id}">Szerkesztés</button>
            <button class="delete" data-id="${classInfo.id}">Törlés</button>
          </div>
        ` : ''}
      </td>`;
  }

  function attachEventListeners() {
    timetable.querySelectorAll('.edit').forEach(button =>
      button.addEventListener('click', () => openEditForm(button.dataset.id))
    );
    timetable.querySelectorAll('.delete').forEach(button =>
      button.addEventListener('click', () => deleteClass(button.dataset.id))
    );
  }

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newClass = Object.fromEntries(new FormData(addForm));
    await sendRequest('/class', 'POST', newClass);
    addForm.reset();
    await fetchTimetable(); // Frissítés
  });

  function openEditForm(id) {
    const classToEdit = timetableData.find(c => c.id == id);
    if (!classToEdit) return console.error('Class not found');
    Object.entries(classToEdit).forEach(([key, value]) => {
      const input = editForm.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    });
    editContainer.classList.remove('hidden');
  }

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedClass = Object.fromEntries(new FormData(editForm));
    await sendRequest(`/class/${updatedClass.id}`, 'PUT', updatedClass);
    editForm.reset();
    editContainer.classList.add('hidden');
    await fetchTimetable(); // Frissítés
  });

  async function deleteClass(id) {
    await sendRequest(`/timetable/${id}`, 'DELETE');
    await fetchTimetable(); // Frissítés
  }

  async function sendRequest(url, method, body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null,
      };
      const response = await fetch(url, options);
      if (!response.ok) console.error(`Failed to ${method} data:`, await response.json());
    } catch (error) {
      console.error(`Failed to ${method} data:`, error);
    }
  }

  cancelEditButton.addEventListener('click', () => {
    editForm.reset();
    editContainer.classList.add('hidden');
  });

  await fetchTimetable(); // Az első adatbetöltés

});
