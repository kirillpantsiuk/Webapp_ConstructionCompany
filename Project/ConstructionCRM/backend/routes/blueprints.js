const express = require('express');
const multer = require('multer');
const path = require('path');
const Blueprint = require('../models/Blueprint'); // Підключаємо нашу модель
const router = express.Router();

// 1. Налаштовуємо Multer (куди і як зберігати файли)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Папка, куди фізично зберігатимуться картинки
  },
  filename: function (req, file, cb) {
    // Створюємо унікальне ім'я файлу (поточний час + оригінальне розширення)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фільтр, щоб приймалися лише картинки
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Дозволені лише зображення!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// 2. POST запит: Завантаження нового креслення
// 'image' — це ім'я поля, яке ми будемо відправляти з React
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не завантажено' });
    }

    // Створюємо новий запис у базі даних
    const newBlueprint = new Blueprint({
      name: req.body.name || req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}` // Зберігаємо лише шлях!
    });

    const savedBlueprint = await newBlueprint.save();
    res.status(201).json(savedBlueprint);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера при збереженні креслення' });
  }
});

// 3. GET запит: Отримання списку всіх креслень
router.get('/', async (req, res) => {
  try {
    const blueprints = await Blueprint.find().sort({ createdAt: -1 }); // Нові зверху
    res.json(blueprints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при отриманні креслень' });
  }
});

// 4. DELETE запит: Видалення креслення (за бажанням)
router.delete('/:id', async (req, res) => {
  try {
    await Blueprint.findByIdAndDelete(req.params.id);
    // Примітка: для ідеалу тут ще треба видаляти фізичний файл з папки uploads за допомогою fs.unlinkSync
    res.json({ message: 'Креслення видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при видаленні' });
  }
});

module.exports = router;