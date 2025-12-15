const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usuario');

// Registro
router.post('/register', async (req, res) => {
  try {
    console.log('=== DEBUG REGISTRO ===');
    console.log('Username:', req.body.username);
    console.log('Email:', req.body.email);
    console.log('Password existe:', !!req.body.password);
    
    const { username, email, password } = req.body;

    // VALIDACIÓN SIMPLE - Si falla aquí, hay un problema con req.body
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ req.body está vacío o es null');
      return res.status(400).json({ error: 'No se recibieron datos' });
    }

    // Validación de campos
    if (!username || !email || !password) {
      console.log('❌ Campos faltantes:', {
        tieneUsername: !!username,
        tieneEmail: !!email,
        tienePassword: !!password
      });
      return res.status(400).json({ 
        error: 'Por favor proporciona nombre, email y contraseña'
      });
    }

    console.log('✅ Validación pasada');

    // Validar que el usuario no exista
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email ya existe');
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    console.log('✅ Creando usuario...');

    // Crear usuario
    const user = new User({ username, email, password });
    await user.save();

    console.log('✅ Usuario creado:', user.username);

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack completo:', error.stack);
    res.status(500).json({ 
      error: 'Error al registrar usuario', 
      details: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('=== DEBUG LOGIN ===');
    console.log('Body recibido:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso');

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ ERROR LOGIN:', error.message);
    res.status(500).json({ 
      error: 'Error al iniciar sesión', 
      details: error.message 
    });
  }
});

module.exports = router;