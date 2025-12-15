const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usuario');

// Registro
router.post('/register', async (req, res) => {
  try {
    console.log('📦 Body recibido:', req.body);
    console.log('📦 Headers:', req.headers['content-type']);
    
    const { username, email, password } = req.body;

    // ✅ VALIDACIÓN EXPLÍCITA
    if (!username || !email || !password) {
      console.log('❌ Validación fallida:', { username, email, hasPassword: !!password });
      return res.status(400).json({ 
        error: 'Por favor proporciona nombre, email y contraseña',
        received: { 
          username: !!username, 
          email: !!email, 
          password: !!password 
        }
      });
    }

    // Validar que el usuario no exista
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear usuario
    const user = new User({ username, email, password });
    await user.save();

    console.log('✅ Usuario creado:', user.username);

    // Generar token inmediatamente después del registro
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
    console.error('❌ Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('📦 Login body:', req.body);
    
    const { email, password } = req.body;

    // ✅ VALIDACIÓN EXPLÍCITA
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

    console.log('✅ Login exitoso:', user.username);

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
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
});

module.exports = router;