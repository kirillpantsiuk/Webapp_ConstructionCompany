const mongoose = require('mongoose');
const Client = require('../models/Client');
const PassportData = require('../models/PassportData');
const BankDetails = require('../models/BankDetails');

/**
 * @desc    Створити нову карту клієнта (Client + Passport + Bank)
 * @route   POST /api/clients
 * @access  Private (Manager)
 */
const createClient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      surname, firstName, patronymic, phone, email,
      series, number, issueDate, issuedBy,
      iban, bankName, accountOwner
    } = req.body;

    // 1. Перевірка на унікальність Email
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Клієнт з таким Email вже існує' });
    }

    // 2. Створення основного запису клієнта
    // При використанні .create з сесією, дані повертаються як масив
    const client = await Client.create([{
      surname,
      firstName,
      patronymic,
      phone,
      email
    }], { session });

    const clientId = client[0]._id;

    // 3. Створення паспортних даних
    await PassportData.create([{
      series,
      number,
      issueDate,
      issuedBy,
      clientId
    }], { session });

    // 4. Створення банківських реквізитів
    await BankDetails.create([{
      iban,
      bankName,
      accountOwner: accountOwner || `${surname} ${firstName} ${patronymic}`,
      clientId
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Карту клієнта успішно створено',
      clientId: clientId
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Помилка при створенні клієнта:', error);
    res.status(500).json({ 
      message: 'Помилка сервера при збереженні даних', 
      error: error.message 
    });
  }
};

/**
 * @desc    Отримати всіх клієнтів з повними даними (Passport + Bank)
 * @route   GET /api/clients
 * @access  Private (Manager)
 */
const getClients = async (req, res) => {
  try {
    // Отримуємо всіх клієнтів, відсортованих за датою створення (нові зверху)
    const clients = await Client.find({}).sort({ createdAt: -1 });
    
    // Збираємо повні дані для кожного клієнта
    const fullDataClients = await Promise.all(clients.map(async (client) => {
      const passport = await PassportData.findOne({ clientId: client._id });
      const bank = await BankDetails.findOne({ clientId: client._id });
      
      return {
        ...client.toObject(),
        passport: passport || null,
        bank: bank || null
      };
    }));

    res.json(fullDataClients);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні списку клієнтів', error: error.message });
  }
};

/**
 * @desc    Оновити дані клієнта (Client + Passport + Bank)
 * @route   PUT /api/clients/:id
 * @access  Private (Manager)
 */
const updateClient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const clientId = req.params.id;
    const {
      surname, firstName, patronymic, phone, email,
      series, number, issueDate, issuedBy,
      iban, bankName, accountOwner
    } = req.body;

    // 1. Оновлення основних даних клієнта
    const updatedClient = await Client.findByIdAndUpdate(clientId, {
      surname, firstName, patronymic, phone, email
    }, { session, new: true });

    if (!updatedClient) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Клієнта не знайдено' });
    }

    // 2. Оновлення паспортних даних (upsert: true створить запис, якщо його раніше не було)
    await PassportData.findOneAndUpdate(
      { clientId },
      { series, number, issueDate, issuedBy },
      { session, upsert: true }
    );

    // 3. Оновлення банківських даних
    await BankDetails.findOneAndUpdate(
      { clientId },
      { iban, bankName, accountOwner: accountOwner || `${surname} ${firstName} ${patronymic}` },
      { session, upsert: true }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Дані клієнта успішно оновлено' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Помилка оновлення клієнта:', error);
    res.status(500).json({ message: 'Помилка при оновленні даних', error: error.message });
  }
};

/**
 * @desc    Видалити клієнта та всі його дані (Каскадне видалення)
 * @route   DELETE /api/clients/:id
 * @access  Private (Manager)
 */
const deleteClient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const clientId = req.params.id;

    // 1. Видаляємо основний запис
    const clientDeleted = await Client.findByIdAndDelete(clientId, { session });
    
    if (!clientDeleted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Клієнта не знайдено' });
    }

    // 2. Видаляємо паспортні та банківські дані
    await PassportData.findOneAndDelete({ clientId }, { session });
    await BankDetails.findOneAndDelete({ clientId }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Клієнта та пов’язані дані успішно видалено' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Помилка видалення клієнта:', error);
    res.status(500).json({ message: 'Помилка при видаленні клієнта', error: error.message });
  }
};

module.exports = {
  createClient,
  getClients,
  updateClient,
  deleteClient
};