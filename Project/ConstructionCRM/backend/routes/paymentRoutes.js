const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect } = require('../middleware/authMiddleware');

// @desc    Створити нову оплату
// @route   POST /api/payments
router.post('/', protect, async (req, res) => {
    try {
        const { amount, status, accountNumber, clientId, objectId, note } = req.body;
        const payment = new Payment({
            amount: amount || 0,
            status,
            accountNumber,
            clientId,
            objectId,
            note: note || ''
        });
        const createdPayment = await payment.save();
        res.status(201).json(createdPayment);
    } catch (error) {
        res.status(400).json({ message: 'Помилка створення оплати', error: error.message });
    }
});

// @desc    Оновити існуючу оплату (ВИПРАВЛЕННЯ 404)
// @route   PUT /api/payments/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const { status, accountNumber, objectId, clientId, note } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (payment) {
            payment.status = status || payment.status;
            payment.accountNumber = accountNumber || payment.accountNumber;
            payment.objectId = objectId || payment.objectId;
            payment.clientId = clientId || payment.clientId;
            payment.note = note || payment.note;

            const updatedPayment = await payment.save();
            res.json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Запис не знайдено' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Помилка оновлення даних', error: error.message });
    }
});

// @desc    Отримати всі оплати з наповненням даними
router.get('/', protect, async (req, res) => {
    try {
        const payments = await Payment.find({})
            .populate('clientId', 'surname firstName patronymic phone email passport bank')
            .populate('objectId', 'address area coordinates description');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// @desc    Видалити оплату
router.delete('/:id', protect, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (payment) {
            await payment.deleteOne();
            res.json({ message: 'Запис видалено' });
        } else {
            res.status(404).json({ message: 'Запис не знайдено' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Помилка видалення' });
    }
});

module.exports = router;