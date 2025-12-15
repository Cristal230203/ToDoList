const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usuario');

// 🔥 LOG GLOBAL PARA CUALQUIER REQUEST
router.use((req, res, next) => {
  console.log('🔥🔥🔥 REQUEST RECIBIDO EN AUTH ROUTES 🔥🔥🔥');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', JSON.stringify(req.body));
  next();
});

// Registro
router.post('/register', async (req, res) => {
  try {
    console.log('');
    console.log('==========================================');
    console.log('🚀 INICIO REGISTRO');
    console.log('==========================================');
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    console.log('Username:', req.body.username);
    console.log('Email:', req.body.email);
    console.log('Password length:', req.body.password ? req.body.password.length : 0);
    
    const { username, email, password } = req.body;

    // VALIDACIÓN SIMPLE
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ req.body está vacío');
      return res.status(400).json({ error: 'No se recibieron datos' });
    }
    if (!username || !email || !password) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    console.log('✅ Todos los campos presentes');
    console.log('🔍 Buscando si email ya existe...');

    // Validar que el usuario no exista
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email ya registrado');
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    console.log('✅ Email disponible');
    console.log('💾 Creando usuario en base de datos...');

    // Crear usuario
    const user = new User({ username, email, password });
    await user.save();

    console.log('✅ Usuario guardado:', user.username);
    console.log('🔐 Generando token JWT...');

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generado exitosamente');
    console.log('📤 Enviando respuesta al cliente...');

    const response = {
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };

    console.log('Respuesta:', JSON.stringify(response, null, 2));
    console.log('==========================================');
    console.log('🎉 FIN REGISTRO EXITOSO');
    console.log('==========================================');
    console.log('');

    res.status(201).json(response);

  } catch (error) {
    console.log('');
    console.log('==========================================');
    console.log('💥 ERROR EN REGISTRO');
    console.log('==========================================');
    console.error('Error completo:', error);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    console.log('==========================================');
    console.log('');
    
    res.status(500).json({ 
      error: 'Error al registrar usuario', 
      details: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('');
    console.log('🔐 INTENTO DE LOGIN');
    console.log('Body:', JSON.stringify(req.body));
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Faltan credenciales');
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password incorrecto');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso para:', user.username);

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
    console.error('💥 ERROR LOGIN:', error.message);
    res.status(500).json({ 
      error: 'Error al iniciar sesión', 
      details: error.message 
    });
  }
});

module.exports = router;