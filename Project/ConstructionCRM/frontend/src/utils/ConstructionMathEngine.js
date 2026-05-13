/**
 * ПОВНА РЕАЛІЗАЦІЯ МАТЕМАТИЧНОГО АПАРАТУ СИСТЕМИ
 */
export const ConstructionMathEngine = {
  // Константи з Розділу 2.1 та 2.3
  constants: {
    H: 8, // Тривалість робочої зміни (год)
    N: {
      brick: 6,       // Цегла (m1): 6 год/м3
      gasblock: 2,    // Газоблок (m2): 2 год/м3
      machine: 1.5,   // Механізовані норми (Етап 1, 3)
      manual: 8,      // Ручні норми (Етап 3)
      finish: 4       // Оздоблювальні роботи
    },
    Delta: {
      form: 5,    // Delta_form: 3-7 днів (витримка опалубки)
      found: 21,  // Delta_found: 14-28 днів (набір міцності фундаментом)
      belt: 10,   // Delta_belt: 7-14 днів (твердіння армопоясу)
      plast: 12,  // Delta_plast: 10-14 днів (висихання штукатурки)
      screed: 25  // Delta_screed: 21-28 днів (висихання стяжки)
    }
  },

  // 2.1 Функція розрахунку тривалості: d = ceil((V * N) / (R * H))
  calculateDuration: (volume, materialKey, workers) => {
    const V = volume || 1;
    const N = ConstructionMathEngine.constants.N[materialKey] || 4;
    const R = workers || 2;
    const H = ConstructionMathEngine.constants.H;
    return Math.ceil((V * N) / (R * H));
  },

  // 2.2 Функція C(t): Перевірка робочого дня
  isWorkDay: (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 - Нд, 6 - Сб
  },

  // Алгоритм розв'язання рівняння суми C(tau) = d_ij
  findFinishDate: (startDate, duration) => {
    let date = new Date(startDate);
    let daysToApply = duration;
    
    // Якщо старт у вихідний — переносимо на Пн
    while (!ConstructionMathEngine.isWorkDay(date)) {
      date.setDate(date.getDate() + 1);
    }

    while (daysToApply > 1) {
      date.setDate(date.getDate() + 1);
      if (ConstructionMathEngine.isWorkDay(date)) {
        daysToApply--;
      }
    }
    return new Date(date);
  },

  // 2.3 Врахування технологічних перерв Delta (календарні дні)
  addTechPause: (date, deltaDays) => {
    const result = new Date(date);
    result.setDate(result.getDate() + deltaDays);
    return result;
  }
};