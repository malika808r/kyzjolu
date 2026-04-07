// Имитация базы данных (Mock API)
let mockData = [
  { id: 1, name: "Малика", route: "ЦУМ ➔ Джал", time: "20:00", authorId: 1 },
  { id: 2, name: "Айгерим", route: "КНУ ➔ Аламедин", time: "18:30", authorId: 2 },
];

// Read (Чтение списка)
export const getCompanions = () => {
  return new Promise((resolve) => setTimeout(() => resolve([...mockData]), 500));
};

// Create (Создание)
export const createCompanion = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = { id: Date.now(), ...data };
      mockData.push(newItem);
      resolve(newItem);
    }, 500);
  });
};

// Delete (Удаление)
export const deleteCompanion = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockData = mockData.filter(item => item.id !== id);
      resolve({ success: true });
    }, 500);
  });
};