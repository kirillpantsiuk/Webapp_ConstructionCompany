import { ConstructionMathEngine as MathCore } from './ConstructionMathEngine';

/**
 * РЕАЛІЗАЦІЯ ПОВНОГО АЛГОРИТМУ (Етапи 1-7)
 */
export const runFullScheduling = (currentPlan, material, Xin) => {
  const plan = JSON.parse(JSON.stringify(currentPlan));
  const D = MathCore.constants.Delta;
  const projectStart = new Date();

  // Етап 1: Підготовка (Паралельно)
  plan.stages[0].tasks.forEach(t => {
    t.startDate = projectStart.toISOString();
    const duration = MathCore.calculateDuration(t.volume, 'machine', t.assignedWorkers.length);
    t.endDate = MathCore.findFinishDate(projectStart, duration).toISOString();
  });

  // Етап 2: Розмітка (t2,1 >= max(t1,1, t1,2, t1,3))
  const t1Finish = new Date(Math.max(...plan.stages[0].tasks.map(t => new Date(t.endDate))));
  const w2_1 = plan.stages[1].tasks[0];
  w2_1.startDate = t1Finish.toISOString();
  w2_1.endDate = MathCore.findFinishDate(t1Finish, 1).toISOString();
  const w2_2 = plan.stages[1].tasks[1];
  w2_2.startDate = w2_1.endDate;
  w2_2.endDate = MathCore.findFinishDate(new Date(w2_2.startDate), 1).toISOString();

  // Етап 3: Земляні роботи (Ланцюг)
  let currentStart = new Date(w2_2.endDate);
  plan.stages[2].tasks.forEach((t, idx) => {
    t.startDate = currentStart.toISOString();
    const d = MathCore.calculateDuration(t.volume, idx === 0 ? 'machine' : 'manual', t.assignedWorkers.length);
    t.endDate = MathCore.findFinishDate(currentStart, d).toISOString();
    if (idx < 3) currentStart = new Date(t.endDate); // Послідовно для 3.1-3.3
  });

  // Етап 4: Фундамент (Оператор Xin)
  // t4,1 >= max(t3,3 finish, t3,4 finish * Xin)
  const t3_3Finish = new Date(plan.stages[2].tasks[2].endDate);
  const t3_4Finish = new Date(plan.stages[2].tasks[3].endDate);
  const t4_1Start = Xin === 1 ? new Date(Math.max(t3_3Finish, t3_4Finish)) : t3_3Finish;

  const w4_1 = plan.stages[3].tasks[0];
  w4_1.startDate = t4_1Start.toISOString();
  w4_1.endDate = MathCore.findFinishDate(t4_1Start, 2).toISOString();

  const w4_2 = plan.stages[3].tasks[1]; // Арматура (Паралельно-послідовно + 2 дні)
  const t4_2Start = MathCore.findFinishDate(new Date(w4_1.startDate), 2);
  w4_2.startDate = t4_2Start.toISOString();
  w4_2.endDate = MathCore.findFinishDate(t4_2Start, 3).toISOString();

  const w4_3 = plan.stages[3].tasks[2]; // Бетон: max(t4,1, t4,2)
  const t4_3Start = new Date(Math.max(new Date(w4_1.endDate), new Date(w4_2.endDate)));
  w4_3.startDate = t4_3Start.toISOString();
  w4_3.endDate = MathCore.findFinishDate(t4_3Start, 1).toISOString();

  // t4,4 (Демонтаж) >= t4,3 + Delta_form
  const w4_4 = plan.stages[3].tasks[3];
  const t4_4Start = MathCore.addTechPause(new Date(w4_3.endDate), D.form);
  w4_4.startDate = t4_4Start.toISOString();
  w4_4.endDate = MathCore.findFinishDate(t4_4Start, 1).toISOString();

  // Етап 5: Монтаж (Delta_found)
  // t5,1 >= t4,3 + Delta_found
  const t5_1Start = MathCore.addTechPause(new Date(w4_3.endDate), D.found);
  const w5_1 = plan.stages[4].tasks[0];
  w5_1.startDate = t5_1Start.toISOString();
  w5_1.endDate = MathCore.findFinishDate(t5_1Start, MathCore.calculateDuration(w5_1.volume, material, 3)).toISOString();

  const w5_2 = plan.stages[4].tasks[1]; // Армопояс
  w5_2.startDate = w5_1.endDate;
  w5_2.endDate = MathCore.findFinishDate(new Date(w5_2.startDate), 2).toISOString();

  const w5_3 = plan.stages[4].tasks[2]; // Дах >= t5,2 + Delta_belt
  const t5_3Start = MathCore.addTechPause(new Date(w5_2.endDate), D.belt);
  w5_3.startDate = t5_3Start.toISOString();
  w5_3.endDate = MathCore.findFinishDate(t5_3Start, 7).toISOString();

  // Етап 6: Оздоблення (Подвійна пауза)
  // t6,4 >= max(t6,2 + Delta_plast, t6,3 + Delta_screed)
  const t5Finish = new Date(Math.max(new Date(w5_3.endDate), new Date(plan.stages[4].tasks[3].endDate)));
  let t6Start = t5Finish;
  plan.stages[5].tasks.forEach((t, idx) => {
    if (idx < 3) {
      t.startDate = t6Start.toISOString();
      t.endDate = MathCore.findFinishDate(t6Start, 5).toISOString();
      t6Start = new Date(t.endDate);
    }
  });

  const w6_4 = plan.stages[5].tasks[3]; // Чистове
  const t6_2Finish = new Date(plan.stages[5].tasks[1].endDate);
  const t6_3Finish = new Date(plan.stages[5].tasks[2].endDate);
  const t6_4Start = new Date(Math.max(
    MathCore.addTechPause(t6_2Finish, D.plast).getTime(),
    MathCore.addTechPause(t6_3Finish, D.screed).getTime()
  ));
  w6_4.startDate = t6_4Start.toISOString();
  w6_4.endDate = MathCore.findFinishDate(t6_4Start, 7).toISOString();

  // Етап 7: Здача
  const w7_1 = plan.stages[6].tasks[0];
  w7_1.startDate = w6_4.endDate;
  w7_1.endDate = MathCore.findFinishDate(new Date(w7_1.startDate), 2).toISOString();
  const w7_2 = plan.stages[6].tasks[1];
  w7_2.startDate = w7_1.endDate;
  w7_2.endDate = MathCore.findFinishDate(new Date(w7_2.startDate), 1).toISOString();

  // РОЗРАХУНОК SLACK (S_ij) для 3.4
  const earliestStart3_4 = new Date(plan.stages[2].tasks[3].startDate);
  const latestStart3_4 = Xin === 0 ? new Date(t4_1Start) : earliestStart3_4;
  plan.stages[2].tasks[3].slack = (latestStart3_4 - earliestStart3_4) / (1000 * 60 * 60 * 24);

  return plan;
};