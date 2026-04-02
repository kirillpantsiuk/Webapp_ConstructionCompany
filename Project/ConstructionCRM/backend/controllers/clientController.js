const Client = require('../models/Client');
const PassportData = require('../models/PassportData');
const BankDetails = require('../models/BankDetails');

// @desc    Створити нову карту клієнта (Client + Passport + Bank)
// @route   POST /api/clients
// @access  Private (Manager)
const createClient = async (req, res) => {
  try {
    const {
      surname, firstName, patronymic, phone, email,
      series, number, issueDate, issuedBy,
      iban, bankName, accountOwner
    } = req.body;

    // 1. Перевірка, чи клієнт з таким email вже існує
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ message: 'Клієнт з такою електронною поштою вже зареєстрований' });
    }

    // 2. Створення основного запису клієнта
    const client = await Client.create({
      surname,
      firstName,
      patronymic,
      phone,
      email
    });

    if (client) {
      // 3. Створення паспортних даних, прив'язаних до clientId
      await PassportData.create({
        series,
        number,
        issueDate,
        issuedBy,
        clientId: client._id
      });

      // 4. Створення банківських реквізитів, прив'язаних до clientId
      await BankDetails.create({
        iban,
        bankName,
        accountOwner: accountOwner || `${surname} ${firstName} ${patronymic}`,
        clientId: client._id
      });

      res.status(201).json({
        message: 'Карту клієнта успішно створено та синхронізовано',
        clientId: client._id
      });
    } else {
      res.status(400).json({ message: 'Невірні дані клієнта' });
    }
  } catch (error) {
    console.error('Помилка при створенні клієнта:', error);
    res.status(500).json({ 
      message: 'Помилка сервера при збереженні даних', 
      error: error.message 
    });
  }
};

// @desc    Отримати всіх клієнтів (для огляду в дашборді)
// @route   GET /api/clients
// @access  Private (Manager)
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні списку клієнтів' });
  }
};

module.exports = {
  createClient,
  getClients
};