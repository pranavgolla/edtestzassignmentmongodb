const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/UserRegister");
const Appointment = require("../models/AppointmentModel");

const createUserRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'Registration successful' });
    console.log('Registration successful');
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password.toString(), user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
    console.log('Login successful');
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { email, date } = req.body;

    if (!email || !date) {
      return res.status(400).json({ message: 'Email and date are required' });
    }

    const appointment = new Appointment({ email, date });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error inserting appointment:', error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};

const getAllUserAppointments = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const appointments = await Appointment.find({ email });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

module.exports = { createUserRegister, loginUser, createAppointment, getAllUserAppointments };
