const db = require('../db');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const { sendMessage } = require('../utils/socket-io');

const generateAcessToken = (id, email) => {
  const payload = { id, email };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class UserController {
  async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }
      const { first_name, last_name, email, phone, password } = req.body;
      const hashPassword = bcrypt.hashSync(password, 7);
      const candidate = await db.query(
        'SELECT * FROM person where email = $1',
        [email]
      );
      console.log(candidate.rows[0]);
      if (candidate.rows[0]) {
        return res
          .status(400)
          .json({ message: `User with email: ${email} already exists` });
      }
      const newPerson = await db.query(
        'INSERT INTO person (first_name, last_name, email, phone, password) values ($1, $2, $3, $4, $5) RETURNING *',
        [first_name, last_name, email, phone, hashPassword]
      );
      res.json({ message: 'User successfully registered' });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async getOneUser(req, res) {
    try {
      const id = req.params.id;
      const user = await db.query('SELECT * FROM person where email = $1', [
        id,
      ]);
      res.json(user.rows[0]);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Get user error' });
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const { first_name, last_name, email, phone, password } = req.body;
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await db.query(
        'UPDATE person set first_name = $1, last_name = $2, email = $3, phone = $4, password = $5 where id = $6 RETURNING *',
        [first_name, last_name, email, phone, hashPassword, id]
      );
      res.json(user.rows[0]);
      sendMessage('notification', 'Updated user successfully');
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Update user error' });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await db.query('SELECT * FROM person where email = $1', [
        email,
      ]);
      if (!user) {
        return res
          .status(400)
          .json({ message: `User with email: ${email} not found` });
      }
      console.log(password);
      console.log(user.rows[0].password);
      const validPassword = bcrypt.compareSync(password, user.rows[0].password);
      if (!validPassword) {
        return res.status(400).json({ message: 'You entered wrong password' });
      }
      const token = generateAcessToken(user.id, user.email);
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Login error' });
    }
  }
}

module.exports = new UserController();
